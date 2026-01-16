'use client';

// Markdown component not available, using raw text for now

interface ProposalDisplayProps {
  result: any;
}

export function ProposalDisplay({ result }: ProposalDisplayProps) {
  if (!result) return null;

  if (!result.success) {
    return (
      <div className='rounded-md border border-red-200 bg-red-50 p-4 text-red-700'>
        <h3 className='font-bold'>Error</h3>
        <p>{result.error}</p>
      </div>
    );
  }

  // Use a simple whitespace pre-wrap for now if Markdown component isn't readily available
  // Or just basic div structure

  return (
    <div className='space-y-6'>
      <div className='rounded-lg border border-blue-100 bg-blue-50 p-6'>
        <h3 className='mb-2 text-lg font-semibold text-blue-900'>
          Research Summary
        </h3>
        <div className='prose max-w-none whitespace-pre-wrap text-blue-800'>
          {result.research}
        </div>
      </div>

      <div className='space-y-4'>
        {Object.entries(result.sections || {}).map(([title, content]) => (
          <div
            key={title}
            className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'
          >
            <h3 className='mb-4 text-xl font-bold text-gray-900'>{title}</h3>
            <div className='prose max-w-none whitespace-pre-wrap text-gray-800'>
              {content as string}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
