'use client';

import { Button } from '@/components/ui/button';
import { Opportunity } from '@/types/modules';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { OpportunityViewModal } from './opportunity-view-modal';

interface CellActionProps {
  data: Opportunity;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <OpportunityViewModal
        isOpen={open}
        onClose={() => setOpen(false)}
        data={data}
      />
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setOpen(true)}
        title='View Details'
      >
        <Eye className='h-4 w-4' />
        <span className='sr-only'>View Details</span>
      </Button>
    </>
  );
};
