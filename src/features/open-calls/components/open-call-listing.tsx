import { fakeOpenCalls } from '@/constants/mock-modules';
import { searchParamsCache } from '@/lib/searchparams';
import OpenCallTable from './open-calls-tables';

type OpenCallListingPageProps = {};

export default async function OpenCallListingPage({}: OpenCallListingPageProps) {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const categories = searchParamsCache.get('categories');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const data = await fakeOpenCalls.getAll(filters);
  const totalItems = data.length; // Mock total items for now

  return <OpenCallTable data={data} totalItems={totalItems} />;
}
