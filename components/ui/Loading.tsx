import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  message?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  className 
}) => {
  return (
    <div className={cn(
      "fixed inset-0 bg-black/50 backdrop-blur-sm z-50",
      "flex flex-col items-center justify-center",
      className
    )}>
      <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-white/10">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <p className="text-white font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading; 
