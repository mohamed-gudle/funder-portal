'use client';

import { useState, useEffect } from 'react';
import { Opportunity } from '@/types/modules';
import OpportunitiesTable from './opportunities-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OpportunitiesListingPage() {
  const [query, setQuery] = useState('solar energy grants in africa');
  const [maxIterations, setMaxIterations] = useState(2);
  const [data, setData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [saving, setSaving] = useState(false);

  // Saved opportunities state
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>(
    []
  );
  const [loadingSaved, setLoadingSaved] = useState(false);

  const fetchSavedOpportunities = async () => {
    setLoadingSaved(true);
    try {
      const response = await fetch('/api/opportunities');
      if (!response.ok) {
        throw new Error('Failed to fetch saved opportunities');
      }
      const result = await response.json();
      setSavedOpportunities(result);
    } catch (error) {
      console.error(error);
      toast.error('Error loading saved opportunities');
    } finally {
      setLoadingSaved(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchSavedOpportunities();
  }, []);

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
      const savedList = result?.saved || [];

      // Update local saved list immediately
      setSavedOpportunities((prev) => {
        // Simple merge or refetch. Since bulk save might update existing,
        // a refetch or smart merge is safest. Let's merge by unshifting new ones
        // to top, but simplest is just to trigger a refetch or use result.saved.
        // Given result.saved contains the updated docs, we can prepend them or replace.
        // Actually, let's just refetch to be consistent with sort order etc.
        return prev;
      });
      fetchSavedOpportunities(); // Refresh the saved list

      const savedCount = savedList.length || data.length;
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

      <Tabs defaultValue='find' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='find'>Find Opportunities</TabsTrigger>
          <TabsTrigger value='saved' onClick={() => fetchSavedOpportunities()}>
            Saved Opportunities
          </TabsTrigger>
        </TabsList>

        <TabsContent value='find' className='space-y-4'>
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
              <h3 className='text-lg font-medium'>Search Results</h3>
              <OpportunitiesTable data={data} totalItems={data.length} />
            </div>
          )}
        </TabsContent>

        <TabsContent value='saved' className='space-y-4'>
          {loadingSaved ? (
            <div className='flex h-24 items-center justify-center'>
              <Loader2 className='h-6 w-6 animate-spin' />
            </div>
          ) : (
            <>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium'>
                  Saved Opportunities ({savedOpportunities.length})
                </h3>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={fetchSavedOpportunities}
                >
                  Refresh
                </Button>
              </div>
              <OpportunitiesTable
                data={savedOpportunities}
                totalItems={savedOpportunities.length}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
