import { useState } from 'react';
import type { CreateJobInput, JobStatus } from '../types';

interface Props {
  onSubmit: (job: CreateJobInput) => void;
  onCancel: () => void;
}

export default function JobForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<CreateJobInput>({
    company: '',
    position: '',
    status: 'sent',
    applied_date: new Date().toISOString().split('T')[0],
    notes: '',
    job_url: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Нова заявка</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="company"
            placeholder="Компанія"
            value={form.company}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            name="position"
            placeholder="Посада"
            value={form.position}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="sent">Відправлено</option>
            <option value="interview">Інтерв'ю</option>
            <option value="rejected">Відмова</option>
            <option value="offer">Оффер</option>
          </select>
          <input
            name="applied_date"
            type="date"
            value={form.applied_date}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            name="job_url"
            placeholder="Посилання на вакансію"
            value={form.job_url}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <textarea
            name="notes"
            placeholder="Нотатки"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="border rounded-lg px-3 py-2 text-sm resize-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700"
            >
              Додати
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}