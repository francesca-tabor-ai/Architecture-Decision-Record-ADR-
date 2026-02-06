import { ADRStatus } from '@/lib/types';

const statusConfig: Record<ADRStatus, { label: string; className: string }> = {
  proposed: {
    label: 'Proposed',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  deprecated: {
    label: 'Deprecated',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  },
  superseded: {
    label: 'Superseded',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
};

export default function StatusBadge({ status }: { status: ADRStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
