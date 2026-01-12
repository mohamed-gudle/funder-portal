'use client';

import useSWR from 'swr';
import { useState } from 'react';

// Authenticated fetcher that includes cookies
const fetcher = (url: string) =>
  fetch(url, {
    credentials: 'include' // Include cookies for authentication
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
    return res.json();
  });

// Fetch user profile (including team member data)
export function useUserProfile() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/user/profile',
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate
  };
}

// Create team member mutation hook
export function useCreateTeamMember() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async (data: {
    name: string;
    email: string;
    phoneNumber?: string;
    speciality?: string;
    position?: string;
    profilePhoto?: string;
  }) => {
    setIsPending(true);
    setError(null);
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include' // Include cookies for authentication
      });
      if (!res.ok) throw new Error('Failed to create team member');
      return res.json();
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

// Update team member mutation hook
export function useUpdateTeamMember() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async ({
    id,
    data
  }: {
    id: string;
    data: {
      name?: string;
      phoneNumber?: string;
      speciality?: string;
      position?: string;
    };
  }) => {
    setIsPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include' // Include cookies for authentication
      });
      if (!res.ok) throw new Error('Failed to update team member');
      return res.json();
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}
