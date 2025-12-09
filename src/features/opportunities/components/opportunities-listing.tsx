'use client';

import { useState } from 'react';
import { Opportunity } from '@/types/modules';
import OpportunitiesTable from './opportunities-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function OpportunitiesListingPage() {
  const [query, setQuery] = useState('solar energy grants in africa');
  const [maxIterations, setMaxIterations] = useState(2);
  const [data, setData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setSearched(true);
    try {
      const url = new URL(
        'https://data-visualizer-agent-production.up.railway.app/program_finder/find_programs'
      );
      url.searchParams.append('query', query);
      url.searchParams.append('max_iterations', maxIterations.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch opportunities');
      }

      const result = await response.json();
      // The API returns an array of objects.
      setData(result);
      toast.success(`Found ${result.length} opportunities`);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching opportunities');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResults = async () => {
    if (!data.length) {
      toast.error('No results to save yet. Run a search first.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          opportunities: data,
          query,
          maxIterations
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save opportunities');
      }

      const result = await response.json();
      if (Array.isArray(result?.saved)) {
        setData(result.saved);
      }
      const savedCount = result?.saved?.length ?? data.length;
      toast.success(`Saved ${savedCount} opportunities to your table`);
    } catch (error) {
      console.error(error);
      toast.error('Unable to save opportunities');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='flex flex-col space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>Program Finder</h2>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Search Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-end gap-4 md:flex-row'>
            <div className='grid w-full max-w-sm items-center gap-1.5'>
              <label
                htmlFor='query'
                className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Search Query
              </label>
              <Input
                id='query'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='e.g. solar energy grants in africa'
              />
            </div>
            <div className='grid w-full max-w-[150px] items-center gap-1.5'>
              <label
                htmlFor='iterations'
                className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Max Iterations
              </label>
              <Input
                id='iterations'
                type='number'
                min={1}
                max={5}
                value={maxIterations}
                onChange={(e) => setMaxIterations(parseInt(e.target.value))}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : null}
              Search
            </Button>
            <Button
              variant='outline'
              onClick={handleSaveResults}
              disabled={saving || loading || data.length === 0}
            >
              {saving ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Save className='mr-2 h-4 w-4' />
              )}
              Save results
            </Button>
          </div>
        </CardContent>
      </Card>

      {searched && (
        <div className='space-y-4'>
          <OpportunitiesTable data={data} totalItems={data.length} />
        </div>
      )}
    </div>
  );
}
