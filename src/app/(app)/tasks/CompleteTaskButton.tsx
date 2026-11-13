'use client';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { completeTask_action } from '@/app/actions/tasks';
import { useRouter } from 'next/navigation';

export function CompleteTaskButton({ taskId }: { taskId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handle = async () => {
    setLoading(true);
    await completeTask_action(taskId);
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="text-xs text-emerald-brand hover:text-forest flex items-center gap-1 font-medium disabled:opacity-50 transition-colors"
    >
      <CheckCircle2 className="w-4 h-4" />
      {loading ? '...' : 'Complete'}
    </button>
  );
}
