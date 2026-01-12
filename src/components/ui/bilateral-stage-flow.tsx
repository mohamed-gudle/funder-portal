'use client';

import { cn } from '@/lib/utils';
import {
  Mail,
  Handshake,
  FileText,
  FileSignature,
  Users,
  Landmark,
  UserX,
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

// The bilateral workflow stages with proper branching
const stageFlow: StageNode[] = [
  {
    id: 'Cold Email',
    label: 'Cold Email',
    icon: Mail,
    branches: ['First Engagement']
  },
  {
    id: 'First Engagement',
    label: 'First Engagement',
    icon: Handshake,
    branches: ['Proposal Stage']
  },
  {
    id: 'Proposal Stage',
    label: 'Proposal Stage',
    icon: FileText,
    branches: ['Contracting']
  },
  {
    id: 'Contracting',
    label: 'Contracting',
    icon: FileSignature,
    branches: ['Partner', 'Funder', 'No Relationship']
  },
  { id: 'Partner', label: 'Partner', icon: Users },
  { id: 'Funder', label: 'Funder', icon: Landmark },
  { id: 'No Relationship', label: 'No Relationship', icon: UserX }
];

// Get the stage index for ordering
function getStageOrder(stageId: string): number {
  const order: Record<string, number> = {
    'Cold Email': 0,
    'First Engagement': 1,
    'Proposal Stage': 2,
    Contracting: 3,
    Partner: 4,
    Funder: 4, // Same level as Partner
    'No Relationship': 4 // Same level as outcomes
  };
  return order[stageId] ?? -1;
}

interface BilateralStageFlowProps {
  currentStep: string;
  onStepClick?: (step: string) => void;
  className?: string;
}

export function BilateralStageFlow({
  currentStep,
  onStepClick,
  className
}: BilateralStageFlowProps) {
  const currentOrder = getStageOrder(currentStep);

  // Split stages into main flow and outcome branches
  const mainStages = stageFlow.filter(
    (s) => s.id !== 'Partner' && s.id !== 'Funder' && s.id !== 'No Relationship'
  );
  const outcomeStages = stageFlow.filter(
    (s) => s.id === 'Partner' || s.id === 'Funder' || s.id === 'No Relationship'
  );

  const renderStageButton = (stage: StageNode, isOutcome = false) => {
    const stageOrder = getStageOrder(stage.id);
    const isCompleted = currentOrder > stageOrder;
    const isCurrent = stage.id === currentStep;
    const Icon = stage.icon;

    // Special styling for outcomes
    const isPartner = stage.id === 'Partner';
    const isFunder = stage.id === 'Funder';
    const isNoRelationship = stage.id === 'No Relationship';
    const isPositiveOutcome = isPartner || isFunder;

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
            !isPositiveOutcome &&
            !isNoRelationship &&
            'border-primary bg-primary/5',
          // Completed state
          isCompleted &&
            !isPositiveOutcome &&
            !isNoRelationship &&
            'border-primary/50 bg-primary/10',
          // Positive outcome colors (Partner/Funder)
          isPositiveOutcome && isCurrent && 'border-emerald-500 bg-emerald-50',
          isPositiveOutcome &&
            isCompleted &&
            'border-emerald-400 bg-emerald-50',
          // No Relationship styling
          isNoRelationship && isCurrent && 'border-rose-500 bg-rose-50',
          isNoRelationship && isCompleted && 'border-rose-400 bg-rose-50',
          // Disabled state for non-clickable outcomes
          isOutcome &&
            !isCurrent &&
            currentOrder === 4 &&
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
            isCurrent &&
              !isPositiveOutcome &&
              !isNoRelationship &&
              'bg-primary text-white',
            // Completed
            isCompleted &&
              !isPositiveOutcome &&
              !isNoRelationship &&
              'bg-primary/80 text-white',
            // Positive outcomes (Partner/Funder)
            isPositiveOutcome &&
              (isCurrent || isCompleted) &&
              'bg-emerald-500 text-white',
            isPositiveOutcome &&
              !isCurrent &&
              !isCompleted &&
              'bg-emerald-100 text-emerald-600',
            // No Relationship
            isNoRelationship &&
              (isCurrent || isCompleted) &&
              'bg-rose-500 text-white',
            isNoRelationship &&
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
              !isPositiveOutcome &&
              !isNoRelationship &&
              'text-primary',
            isPositiveOutcome &&
              (isCurrent || isCompleted) &&
              'text-emerald-700',
            isNoRelationship && (isCurrent || isCompleted) && 'text-rose-700'
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

      {/* Branching outcomes after Contracting */}
      <div className='mt-4 flex items-start gap-4 pl-0'>
        {/* Vertical connector from Contracting */}
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
export const bilateralStagesWithFlow = [
  'Cold Email',
  'First Engagement',
  'Proposal Stage',
  'Contracting',
  'Partner',
  'Funder',
  'No Relationship'
] as const;

export type BilateralStage = (typeof bilateralStagesWithFlow)[number];
