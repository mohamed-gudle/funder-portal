import { searchParamsCache } from '@/lib/searchparams';
import BilateralTable from './bilateral-tables';

type BilateralListingPageProps = {};

export default async function BilateralListingPage({}: BilateralListingPageProps) {
  const search = searchParamsCache.get('q');
  const stage = searchParamsCache.get('stage');
  const sector = searchParamsCache.get('sector');

  // Build query parameters
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (stage) params.append('stage', stage);
  if (sector) params.append('sector', sector);

  // Fetch data from API
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/bilateral-engagements${params.toString() ? `?${params.toString()}` : ''}`;

  let data = [];
  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store'
    });
    if (response.ok) {
      data = await response.json();
    }
  } catch (error) {
    console.error('Error fetching bilateral engagements:', error);
  }

  const totalItems = data.length;

  return <BilateralTable data={data} totalItems={totalItems} />;
}
