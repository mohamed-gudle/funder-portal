'use client';

import { cn } from '@/lib/utils';
import {
  Search,
  GitBranch,
  PenLine,
  ClipboardCheck,
  Send,
  MailCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowDown
} from 'lucide-react';

// Define the stage flow structure with branches
interface StageNode {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  branches?: string[]; // IDs of next possible stages
}

// The workflow stages with proper branching
const stageFlow: StageNode[] = [
  { id: 'In Review', label: 'In Review', icon: Search, branches: ['Go/No-Go'] },
  {
    id: 'Go/No-Go',
    label: 'Go/No-Go',
    icon: GitBranch,
    branches: ['Proposal Writing']
  },
  {
    id: 'Proposal Writing',
    label: 'Proposal Writing',
    icon: PenLine,
    branches: ['Internal Review']
  },
  {
    id: 'Internal Review',
    label: 'Internal Review',
    icon: ClipboardCheck,
    branches: ['Submission Stage']
  },
  {
    id: 'Submission Stage',
    label: 'Submission Stage',
    icon: Send,
    branches: ['Submitted']
  },
  {
    id: 'Submitted',
    label: 'Submitted',
    icon: MailCheck,
    branches: ['Accepted', 'Rejected']
  },
  { id: 'Accepted', label: 'Accepted', icon: CheckCircle2 },
  { id: 'Rejected', label: 'Rejected', icon: XCircle }
];

// Get the stage index for ordering (special handling for outcomes)
function getStageOrder(stageId: string): number {
  const order: Record<string, number> = {
    'In Review': 0,
    'Go/No-Go': 1,
    'Proposal Writing': 2,
    'Internal Review': 3,
    'Submission Stage': 4,
    Submitted: 5,
    Accepted: 6,
    Rejected: 6 // Same level as Accepted
  };
  return order[stageId] ?? -1;
}

interface StageFlowProps {
  currentStep: string;
  onStepClick?: (step: string) => void;
  className?: string;
}

export function StageFlow({
  currentStep,
  onStepClick,
  className
}: StageFlowProps) {
  const currentOrder = getStageOrder(currentStep);

  // Split stages into main flow and outcome branches
  const mainStages = stageFlow.filter(
    (s) => s.id !== 'Accepted' && s.id !== 'Rejected'
  );
  const outcomeStages = stageFlow.filter(
    (s) => s.id === 'Accepted' || s.id === 'Rejected'
  );

  const renderStageButton = (stage: StageNode, isOutcome = false) => {
    const stageOrder = getStageOrder(stage.id);
    const isCompleted = currentOrder > stageOrder;
    const isCurrent = stage.id === currentStep;
    const Icon = stage.icon;

    // Special styling for outcomes
    const isAccepted = stage.id === 'Accepted';
    const isRejected = stage.id === 'Rejected';

    return (
      <button
        key={stage.id}
        onClick={() => onStepClick?.(stage.id)}
        disabled={!onStepClick}
        className={cn(
          'group flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all',
          'hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none',
          // Default state
          !isCompleted && !isCurrent && 'border-gray-200 bg-gray-50',
          // Current state
          isCurrent &&
            !isAccepted &&
            !isRejected &&
            'border-primary bg-primary/5',
          // Completed state
          isCompleted &&
            !isAccepted &&
            !isRejected &&
            'border-primary/50 bg-primary/10',
          // Outcome specific colors
          isAccepted && isCurrent && 'border-emerald-500 bg-emerald-50',
          isAccepted && isCompleted && 'border-emerald-400 bg-emerald-50',
          isRejected && isCurrent && 'border-rose-500 bg-rose-50',
          isRejected && isCompleted && 'border-rose-400 bg-rose-50',
          // Disabled state for non-clickable outcomes when on the other outcome
          isOutcome &&
            !isCurrent &&
            currentOrder === 6 &&
            'cursor-not-allowed opacity-40'
        )}
      >
        {/* Icon */}
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            // Default
            !isCompleted && !isCurrent && 'bg-gray-200 text-gray-500',
            // Current
            isCurrent && !isAccepted && !isRejected && 'bg-primary text-white',
            // Completed
            isCompleted &&
              !isAccepted &&
              !isRejected &&
              'bg-primary/80 text-white',
            // Outcomes
            isAccepted &&
              (isCurrent || isCompleted) &&
              'bg-emerald-500 text-white',
            isRejected &&
              (isCurrent || isCompleted) &&
              'bg-rose-500 text-white',
            isAccepted &&
              !isCurrent &&
              !isCompleted &&
              'bg-emerald-100 text-emerald-600',
            isRejected &&
              !isCurrent &&
              !isCompleted &&
              'bg-rose-100 text-rose-600'
          )}
        >
          <Icon className='h-5 w-5' />
        </span>

        {/* Label */}
        <span
          className={cn(
            'text-sm font-medium',
            !isCompleted && !isCurrent && 'text-gray-500',
            (isCompleted || isCurrent) &&
              !isAccepted &&
              !isRejected &&
              'text-primary',
            isAccepted && (isCurrent || isCompleted) && 'text-emerald-700',
            isRejected && (isCurrent || isCompleted) && 'text-rose-700'
          )}
        >
          {stage.label}
        </span>
      </button>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Main linear flow */}
      <div className='flex flex-wrap items-center gap-2'>
        {mainStages.map((stage, idx) => (
          <div key={stage.id} className='flex items-center gap-2'>
            {renderStageButton(stage)}
            {idx < mainStages.length - 1 && (
              <ArrowRight className='h-5 w-5 shrink-0 text-gray-300' />
            )}
          </div>
        ))}
      </div>

      {/* Branching outcomes after Submitted */}
      <div className='mt-4 flex items-start gap-4 pl-0'>
        {/* Vertical connector from Submitted */}
        <div className='ml-auto flex items-center gap-2'>
          <div className='flex flex-col items-center'>
            <ArrowDown className='h-5 w-5 text-gray-300' />
            <span className='text-muted-foreground my-1 text-xs'>Outcome</span>
          </div>

          {/* Branch outcomes */}
          <div className='flex gap-3'>
            {outcomeStages.map((stage) => renderStageButton(stage, true))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Also export the stage list for use in forms
export const callStagesWithFlow = [
  'In Review',
  'Go/No-Go',
  'Proposal Writing',
  'Internal Review',
  'Submission Stage',
  'Submitted',
  'Accepted',
  'Rejected'
] as const;

export type CallStage = (typeof callStagesWithFlow)[number];
