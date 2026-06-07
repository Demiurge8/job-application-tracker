import type { JobStatus } from '../types';

interface Props {
  status: JobStatus;
}

const statusConfig = {
  sent:      { label: 'Відправлено', className: 'bg-blue-100 text-blue-800' },
  interview: { label: 'Інтерв\'ю',   className: 'bg-yellow-100 text-yellow-800' },
  rejected:  { label: 'Відмова',     className: 'bg-red-100 text-red-800' },
  offer:     { label: 'Оффер',       className: 'bg-green-100 text-green-800' },
};

export default function StatusBadge({ status }: Props) {
  const { label, className } = statusConfig[status];
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}