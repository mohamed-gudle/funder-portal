import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  limit: parseAsInteger.withDefault(10), // Alias for perPage
  q: parseAsString, // Search query
  categories: parseAsString, // Categories filter
  name: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  // Open Calls and Bilateral Engagements filters
  status: parseAsString, // Open Call status filter
  stage: parseAsString, // Bilateral Engagement stage filter
  callStatus: parseAsString,
  priority: parseAsString,
  fundingType: parseAsString,
  sector: parseAsString // Sector filter for both
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
