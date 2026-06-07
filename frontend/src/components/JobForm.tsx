import { useState } from 'react';
import type { CreateJobInput } from '../types';

interface Props {
  onSubmit: (job: CreateJobInput) => void;
  onCancel: () => void;
  initialData?: CreateJobInput;
}

export default function JobForm({ onSubmit, onCancel, initialData }: Props) {
  const [form, setForm] = useState<CreateJobInput>(
    initialData ?? {
      company: '',
      position: '',
      status: 'sent',
      applied_date: new Date().toISOString().split('T')[0],
      notes: '',
      job_url: '',
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClass = "w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors";

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a1d27] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-semibold text-gray-100 mb-5">
          {isEditing ? 'Rediger ansøgning' : 'Ny ansøgning'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="company"
            placeholder="Virksomhed"
            value={form.company}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            name="position"
            placeholder="Stilling"
            value={form.position}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="sent">Sendt</option>
            <option value="interview">Interview</option>
            <option value="rejected">Afslag</option>
            <option value="offer">Tilbud</option>
          </select>
          <input
            name="applied_date"
            type="date"
            value={form.applied_date}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            name="job_url"
            placeholder="Link til jobopslag (valgfrit)"
            value={form.job_url ?? ''}
            onChange={handleChange}
            className={inputClass}
          />
          <textarea
            name="notes"
            placeholder="Noter (valgfrit)"
            value={form.notes ?? ''}
            onChange={handleChange}
            rows={3}
            className={`${inputClass} resize-none`}
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
            >
              {isEditing ? 'Gem ændringer' : 'Tilføj'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg py-2 text-sm font-medium transition-colors"
            >
              Annuller
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}