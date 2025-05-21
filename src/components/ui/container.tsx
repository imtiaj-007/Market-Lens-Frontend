'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  fluid?: boolean;
}

/**
 * Custom container component that behaves like Bootstrap's container
 * Limits content width and centers it horizontally
 * By default, uses max-w-5xl on medium screens and above
 */
export function Container({ 
  children, 
  className, 
  fluid = false 
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full px-4 mx-auto sm:px-6',
        // If fluid is true, the container takes full width
        // Otherwise, use max-w-5xl on md screens and above
        fluid ? '' : 'md:max-w-7xl',
        className
      )}
    >
      {children}
    </div>
  );
} 