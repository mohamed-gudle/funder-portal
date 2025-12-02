'use client';

import { useEffect, useState } from 'react';

export interface TeamMemberOption {
  label: string;
  value: string;
  image: string;
  initials: string;
  email: string;
}

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        setLoading(true);
        const res = await fetch('/api/team');
        if (!res.ok) throw new Error('Failed to fetch team members');
        const data = await res.json();

        const options: TeamMemberOption[] = data.map((member: any) => ({
          label: member.name,
          value: member.name,
          image: member.profilePhoto || '',
          initials: getInitials(member.name),
          email: member.email
        }));

        setTeamMembers(options);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching team members:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  return { teamMembers, loading, error };
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
