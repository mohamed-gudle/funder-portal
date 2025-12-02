import { searchParamsCache } from '@/lib/searchparams';
import OpenCallTable from './open-calls-tables';

type OpenCallListingPageProps = {};

export default async function OpenCallListingPage({}: OpenCallListingPageProps) {
  const search = searchParamsCache.get('q');
  const status = searchParamsCache.get('status');
  const sector = searchParamsCache.get('sector');

  // Build query parameters
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (sector) params.append('sector', sector);

  // Fetch data from API
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/open-calls${params.toString() ? `?${params.toString()}` : ''}`;

  let data = [];
  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store'
    });
    if (response.ok) {
      data = await response.json();
    }
  } catch (error) {
    console.error('Error fetching open calls:', error);
  }

  const totalItems = data.length;

  return <OpenCallTable data={data} totalItems={totalItems} />;
}
