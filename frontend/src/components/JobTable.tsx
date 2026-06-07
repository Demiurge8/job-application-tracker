import type { Job } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  jobs: Job[];
  onDelete: (id: number) => void;
  onStatusChange: (job: Job) => void;
}

export default function JobTable({ jobs, onDelete, onStatusChange }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">Заявок ще немає</p>
        <p className="text-sm mt-1">Натисни "Додати заявку" щоб почати</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Компанія</th>
            <th className="text-left px-4 py-3 font-medium">Посада</th>
            <th className="text-left px-4 py-3 font-medium">Статус</th>
            <th className="text-left px-4 py-3 font-medium">Дата</th>
            <th className="text-left px-4 py-3 font-medium">Нотатки</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">
                {job.job_url ? (
                  <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {job.company}
                  </a>
                ) : (
                  job.company
                )}
              </td>
              <td className="px-4 py-3 text-gray-700">{job.position}</td>
              <td className="px-4 py-3">
                <button onClick={() => onStatusChange(job)}>
                  <StatusBadge status={job.status} />
                </button>
              </td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(job.applied_date).toLocaleDateString('da-DK')}
              </td>
              <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                {job.notes || '—'}
              </td>
              <td className="px-4 py-3">
                <button onClick={() => onDelete(job.id)} className="text-red-400 hover:text-red-600 text-xs">
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}