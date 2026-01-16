'use client';

import { useState } from 'react';
import { generateGrantProposal } from '../actions';

interface GrantFormProps {
  onResult: (result: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function GrantForm({
  onResult,
  isLoading,
  setIsLoading
}: GrantFormProps) {
  const [formData, setFormData] = useState({
    grantName: '',
    focusArea: '',
    requirements: '',
    orgContext: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await generateGrantProposal(formData);
      onResult(result);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-2xl rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-6 text-2xl font-bold text-gray-800'>
        New Grant Proposal
      </h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Grant Opportunity Name
          </label>
          <input
            type='text'
            required
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            value={formData.grantName}
            onChange={(e) =>
              setFormData({ ...formData, grantName: e.target.value })
            }
            placeholder='e.g. NSF Cyberinfrastructure Grant'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Focus Area
          </label>
          <input
            type='text'
            required
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            value={formData.focusArea}
            onChange={(e) =>
              setFormData({ ...formData, focusArea: e.target.value })
            }
            placeholder='e.g. Education, Technology, Healthcare'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Key Requirements (Paste text)
          </label>
          <textarea
            required
            rows={4}
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            value={formData.requirements}
            onChange={(e) =>
              setFormData({ ...formData, requirements: e.target.value })
            }
            placeholder='Paste key requirements from the RFP...'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            Organization Context
          </label>
          <textarea
            required
            rows={4}
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            value={formData.orgContext}
            onChange={(e) =>
              setFormData({ ...formData, orgContext: e.target.value })
            }
            placeholder='Describe your organization and relevant experience...'
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className={`w-full rounded-md px-4 py-3 text-sm font-medium text-white ${
            isLoading
              ? 'cursor-not-allowed bg-blue-400'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
          }`}
        >
          {isLoading ? 'Generating Proposal...' : 'Generate Draft'}
        </button>
      </form>
    </div>
  );
}
