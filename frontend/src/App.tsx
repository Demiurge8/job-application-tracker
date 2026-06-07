import { useState, useEffect } from 'react';
import type { Job, CreateJobInput, JobStatus } from './types';
import { getJobs, createJob, updateJob, deleteJob } from './api/jobs';
import JobTable from './components/JobTable';
import JobForm from './components/JobForm';

const statusOrder: JobStatus[] = ['sent', 'interview', 'rejected', 'offer'];

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  const handleCreate = async (input: CreateJobInput) => {
    const newJob = await createJob(input);
    setJobs([newJob, ...jobs]);
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    await deleteJob(id);
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const handleStatusChange = async (job: Job) => {
    const currentIndex = statusOrder.indexOf(job.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    const updated = await updateJob(job.id, { ...job, status: nextStatus });
    setJobs(jobs.map((j) => (j.id === job.id ? updated : j)));
  };

  const filtered = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
            <p className="text-sm text-gray-500 mt-1">{jobs.length} заявок всього</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + Додати заявку
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {(['all', 'sent', 'interview', 'rejected', 'offer'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                filter === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {s === 'all' ? 'Всі' :
               s === 'sent' ? 'Відправлено' :
               s === 'interview' ? "Інтерв'ю" :
               s === 'rejected' ? 'Відмова' : 'Оффер'}
            </button>
          ))}
        </div>

        {/* Table */}
        <JobTable
          jobs={filtered}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />

        {/* Form Modal */}
        {showForm && (
          <JobForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
}