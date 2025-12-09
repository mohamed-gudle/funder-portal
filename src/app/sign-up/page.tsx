import { redirect } from 'next/navigation';

type SearchParams = Record<string, string | string[] | undefined>;

export default function SignUpRedirectPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else {
      query.set(key, value);
    }
  }

  const target = query.toString()
    ? `/auth/sign-up?${query.toString()}`
    : '/auth/sign-up';

  redirect(target);
}
