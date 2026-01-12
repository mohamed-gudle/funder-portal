'use client';

import useSWR from 'swr';

export interface TeamMemberOption {
  label: string;
  value: string;
  image: string;
  initials: string;
  email: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTeamMembers() {
  const { data, error, isLoading } = useSWR('/api/team', fetcher);

  const teamMembers: TeamMemberOption[] = data
    ? data.map((member: any) => ({
        label: member.name,
        value: member.name,
        image: member.profilePhoto || '',
        initials: getInitials(member.name),
        email: member.email
      }))
    : [];

  return { teamMembers, loading: isLoading, error };
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
