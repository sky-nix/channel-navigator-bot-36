
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className={cn('text-primary font-bold flex items-center', sizeClasses[size])}>
          <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            ChannelGuard
          </span>
        </div>
      </div>
    </div>
  );
}
