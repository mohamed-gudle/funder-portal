import * as XLSX from 'xlsx';
import path from 'path';

/**
 * Convert Excel serial date number to JavaScript Date
 * Excel stores dates as the number of days since 1900-01-01
 */
export function excelDateToJSDate(excelDate: number | string): Date {
  if (typeof excelDate === 'string') {
    // If it's already a string date, try to parse it
    const parsed = new Date(excelDate);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  if (typeof excelDate !== 'number') {
    return new Date();
  }

  // Excel's epoch is 1900-01-01, but Excel incorrectly treats 1900 as a leap year
  // JavaScript Date is milliseconds since 1970-01-01
  const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
  const jsDate = new Date(
    excelEpoch.getTime() + excelDate * 24 * 60 * 60 * 1000
  );

  return jsDate;
}

/**
 * Read Excel file and return parsed data from specified sheet
 */
export function readExcelFile(
  filePath: string,
  sheetName?: string
): Record<string, any>[] {
  const resolvedPath = path.resolve(process.cwd(), filePath);
  const workbook = XLSX.readFile(resolvedPath);

  const targetSheet = sheetName || workbook.SheetNames[0];

  if (!workbook.Sheets[targetSheet]) {
    throw new Error(`Sheet "${targetSheet}" not found in ${filePath}`);
  }

  const worksheet = workbook.Sheets[targetSheet];
  const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  return data as Record<string, any>[];
}

/**
 * Map Open Calls Excel data to database schema
 */
export function mapOpenCallExcelToSchema(row: Record<string, any>) {
  const funder =
    row['Organisation / Fund\n'] || row['Organisation / Fund'] || '';
  const priorityRaw = row['Prioritisation (TBD)'] || 'Medium';
  const deadlineRaw = row['Date (Deadline)'];
  const applicationStatus =
    row['Application submitted '] || row['Application submitted'] || '';
  const toApplyFor =
    row['To Apply For (Yes/ No/ Maybe) '] ||
    row['To Apply For (Yes/ No/ Maybe)'] ||
    '';
  const internalOwnerRaw = row['AFCEN relationship holder'] || '';

  // Map priority
  const priorityMap: Record<string, 'High' | 'Medium' | 'Low'> = {
    High: 'High',
    Medium: 'Medium',
    Low: 'Low'
  };
  const priority = priorityMap[priorityRaw] || 'Medium';

  // Map application status to workflow status
  let status = 'In Review';
  if (applicationStatus.toLowerCase().includes('yes')) {
    status = 'Submitted';
  } else if (applicationStatus.toLowerCase().includes('pending')) {
    status = 'Proposal Writing';
  }

  // Map "To Apply For" to call status
  let callStatus: 'Open' | 'Closed' = 'Open';
  if (toApplyFor.toLowerCase().includes('no')) {
    callStatus = 'Closed';
  }

  // Convert Excel date to JS Date
  const deadline = excelDateToJSDate(deadlineRaw);

  // Extract sectors from AFCEN sector columns
  const sectors: string[] = [];
  if (row['AFCEN sector (Energy)']) sectors.push('Energy');
  if (row['AFCEN sector (Critical minerals)'])
    sectors.push('Critical Minerals');
  if (row['AFCEN sector (Agriculture)']) sectors.push('Agriculture');
  if (row['AFCEN sector (digital platform)']) sectors.push('Digital Platform');
  if (row['AFCEN sector (clean cooking)']) sectors.push('Clean Cooking');
  if (row['AFCEN sector (PPF)']) sectors.push('PPF');
  if (row['General / Multi-sectoral ']) sectors.push('Multi-sectoral');

  // Build description from available fields
  const descriptionParts = [
    row['Focus & Main Goals'] || '',
    row['Country Focus'] ? `Country Focus: ${row['Country Focus']}` : '',
    row['Comments'] ? `Comments: ${row['Comments']}` : ''
  ].filter(Boolean);

  const description =
    descriptionParts.length > 0
      ? descriptionParts.join('\n\n')
      : `Open call from ${funder || 'funder'}`;

  return {
    title: funder || 'Untitled Open Call',
    funder: funder,
    sector: sectors.length > 0 ? sectors : ['General'],
    grantType: row['Type of Funding'] || '',
    budget: row['Amount (typical / example)'] || '',
    deadline: deadline,
    url: row['Website link '] || row['Website link'] || '',
    description: description,
    internalOwner: internalOwnerRaw || 'Unassigned',
    callStatus: callStatus,
    priority: priority,
    fundingType: 'Core Funding' as const,
    status: status,
    stagePermissions: [],
    notes: row['Next steps']
      ? [
          {
            id: `note-${Date.now()}`,
            content: `Next steps: ${row['Next steps']}`,
            author: 'System',
            createdAt: new Date()
          }
        ]
      : [],
    documents: []
  };
}

/**
 * Map Bilateral Engagements Excel data to database schema
 */
export function mapBilateralExcelToSchema(row: Record<string, any>) {
  const organizationName =
    row['Priority Grant Funders'] || 'Untitled Organization';
  const contact = row['Contact '] || row['Contact'] || '';
  const theme = row['Theme'] || '';

  // Extract tags from theme and other fields
  const tags: string[] = [];
  if (theme) tags.push(theme.trim());
  if (row['Investment focus ']) tags.push(row['Investment focus '].trim());
  if (row['Investment type']) tags.push(row['Investment type'].trim());

  // Filter out empty tags
  const filteredTags = tags.filter(Boolean);

  return {
    organizationName: organizationName.trim(),
    contactPerson: contact.trim(),
    contactRole: '',
    email: '', // Could extract from contact if it contains email
    internalOwner: 'Unassigned',
    status: 'Cold Email' as const,
    likelihoodToFund: 50, // Default to medium likelihood
    estimatedValue: 0,
    currency: 'USD' as const,
    tags: filteredTags,
    stagePermissions: [],
    notes: row['Afcen priority project']
      ? [
          {
            id: `note-${Date.now()}`,
            content: `Priority Project: ${row['Afcen priority project']}`,
            author: 'System',
            createdAt: new Date()
          }
        ]
      : [],
    documents: []
  };
}
