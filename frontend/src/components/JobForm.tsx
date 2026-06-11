import { useState } from 'react';
import type { CreateJobInput } from '../types';

interface Props {
  onSubmit: (job: CreateJobInput) => void;
  onCancel: () => void;
  initialData?: CreateJobInput;
}

export default function JobForm({ onSubmit, onCancel, initialData }: Props) {
  const [form, setForm] = useState<CreateJobInput>(
    initialData ? {
      ...initialData,
      applied_date: initialData.applied_date
        ? initialData.applied_date.split('T')[0]
        : new Date().toISOString().split('T')[0],
    } : {
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
  const labelClass = "block text-xs text-gray-500 font-medium mb-1";

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a1d27] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-100">
            {isEditing ? 'Rediger ansøgning' : 'Ny ansøgning'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-400 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Virksomhed *</label>
            <input
              name="company"
              placeholder="f.eks. Netcompany"
              value={form.company}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Stilling *</label>
            <input
              name="position"
              placeholder="f.eks. Junior Frontend Developer"
              value={form.position}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`${inputClass} appearance-none pr-8 cursor-pointer`}
            >
              <option value="sent">Sendt</option>
              <option value="interview">Interview</option>
              <option value="rejected">Afslag</option>
              <option value="offer">Tilbud</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
              ▾
            </div>
          
          </div>

          <div>
            <label className={labelClass}>Dato for ansøgning *</label>
            <input
              name="applied_date"
              type="date"
              value={form.applied_date}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Link til jobopslag</label>
            <input
              name="job_url"
              placeholder="https://..."
              value={form.job_url ?? ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Noter</label>
            <textarea
              name="notes"
              placeholder="Notater om ansøgningen..."
              value={form.notes ?? ''}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-2 mt-1">
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