'use client';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;

export function DialogContent({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/40 z-50 animate-in fade-in-0" />
      <RadixDialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'bg-white rounded-2xl shadow-xl w-full max-w-md p-6',
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <RadixDialog.Title className="text-lg font-semibold text-charcoal">{title}</RadixDialog.Title>
            <RadixDialog.Close className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </RadixDialog.Close>
          </div>
        )}
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
