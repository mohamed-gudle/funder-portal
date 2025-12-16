import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ChevronPathProps {
  steps: string[];
  currentStep: string;
  onStepClick?: (step: string) => void;
  className?: string;
}

export function ChevronPath({
  steps,
  currentStep,
  onStepClick,
  className
}: ChevronPathProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <nav
      aria-label='Progress'
      className={cn('w-full overflow-x-auto md:overflow-visible', className)}
    >
      <ol
        role='list'
        className='divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:flex-wrap md:divide-y-0'
      >
        {steps.map((step, stepIdx) => {
          const isCompleted = currentIndex > stepIdx;
          const isCurrent = step === currentStep;

          return (
            <li
              key={step}
              className='relative min-w-0 md:flex md:min-w-[180px] md:flex-1'
            >
              {/* Button / Container */}
              <button
                onClick={() => onStepClick && onStepClick(step)}
                disabled={!onStepClick}
                className='group flex w-full items-stretch text-left'
              >
                <div className='flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left text-sm font-medium md:px-5'>
                  {/* Icon / Status Indicator */}
                  <span
                    className={cn(
                      'mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
                      isCompleted
                        ? 'border-primary bg-primary text-primary-foreground'
                        : '',
                      isCurrent ? 'border-primary' : '',
                      !isCompleted && !isCurrent ? 'border-gray-300' : ''
                    )}
                  >
                    {isCompleted && (
                      <Check
                        className='h-5 w-5 text-white'
                        aria-hidden='true'
                      />
                    )}
                    {isCurrent && (
                      <span
                        className='bg-primary h-2.5 w-2.5 rounded-full'
                        aria-hidden='true'
                      />
                    )}
                    {!isCompleted && !isCurrent && (
                      <span className='text-gray-500'>{stepIdx + 1}</span>
                    )}
                  </span>

                  {/* Text */}
                  <div className='flex min-w-0 flex-col items-start'>
                    <span
                      className={cn(
                        'text-left text-sm leading-snug font-medium',
                        isCompleted ? 'text-primary' : 'text-gray-900',
                        isCurrent ? 'text-primary' : 'text-gray-500'
                      )}
                    >
                      {step}
                    </span>
                  </div>
                </div>

                {/* Arrow Separator (Desktop) */}
                {stepIdx !== steps.length - 1 && (
                  <div
                    className='absolute top-0 right-0 hidden h-full w-5 md:block'
                    aria-hidden='true'
                  >
                    <svg
                      className='h-full w-full text-gray-300'
                      viewBox='0 0 22 80'
                      preserveAspectRatio='none'
                      fill='none'
                    >
                      <path
                        d='M0 -2L20 40L0 82'
                        vectorEffect='non-scaling-stroke'
                        stroke='currentcolor'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
