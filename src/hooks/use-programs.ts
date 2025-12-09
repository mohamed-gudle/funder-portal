import useSWR from 'swr';
import { useCallback } from 'react';

export interface Program {
  id: string;
  name: string;
  description?: string;
  status: 'Active' | 'Completed' | 'Planned';
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePrograms() {
  const { data, error, isLoading, mutate } = useSWR<Program[]>(
    '/api/programs',
    fetcher
  );

  const createProgram = useCallback(
    async (program: Partial<Program>) => {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(program)
      });

      if (!response.ok) {
        throw new Error('Failed to create program');
      }

      const newProgram = await response.json();

      // Optimistically update the list
      mutate((currentPrograms) => {
        return [newProgram, ...(currentPrograms || [])];
      });

      return newProgram;
    },
    [mutate]
  );

  return {
    programs: data || [],
    isLoading,
    isError: error,
    createProgram
  };
}
