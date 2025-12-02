'use client';

import { Modal } from '@/components/ui/modal';
import { Opportunity } from '@/types/modules';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OpportunityViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Opportunity;
}

export const OpportunityViewModal: React.FC<OpportunityViewModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!data) return null;

  return (
    <Modal
      title={data.title}
      description={data.organization}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ScrollArea className='max-h-[80vh]'>
        <div className='space-y-4 p-1'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-muted-foreground text-sm font-semibold'>
                Amount
              </h4>
              <p className='text-sm'>{data.amount}</p>
            </div>
            <div>
              <h4 className='text-muted-foreground text-sm font-semibold'>
                Deadline
              </h4>
              <p className='text-sm'>{data.deadline}</p>
            </div>
            <div>
              <h4 className='text-muted-foreground text-sm font-semibold'>
                Sector
              </h4>
              <p className='text-sm'>{data.energy_sector}</p>
            </div>
            <div>
              <h4 className='text-muted-foreground text-sm font-semibold'>
                Relevance Score
              </h4>
              <Badge variant='outline'>{data.relevance_score}</Badge>
            </div>
          </div>

          <div>
            <h4 className='text-muted-foreground mb-1 text-sm font-semibold'>
              Description
            </h4>
            <p className='text-justify text-sm'>{data.description}</p>
          </div>

          <div>
            <h4 className='text-muted-foreground mb-1 text-sm font-semibold'>
              Eligibility
            </h4>
            <p className='text-justify text-sm'>{data.eligibility}</p>
          </div>

          <div className='flex justify-end pt-4'>
            <Button asChild>
              <a href={data.url} target='_blank' rel='noopener noreferrer'>
                <ExternalLink className='mr-2 h-4 w-4' />
                Visit Website
              </a>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </Modal>
  );
};
