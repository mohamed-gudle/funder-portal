import { fakeBilateralEngagements } from '@/constants/mock-modules';
import { searchParamsCache } from '@/lib/searchparams';
import BilateralTable from './bilateral-tables';

type BilateralListingPageProps = {};

export default async function BilateralListingPage({}: BilateralListingPageProps) {
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

  const data = await fakeBilateralEngagements.getAll(filters);
  const totalItems = data.length;

  return <BilateralTable data={data} totalItems={totalItems} />;
}
