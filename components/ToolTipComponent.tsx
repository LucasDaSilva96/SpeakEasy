'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type props = {
  children: React.ReactNode;
  hoverText: string;
};

export function TooltipComponent({ hoverText, children }: props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{hoverText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
