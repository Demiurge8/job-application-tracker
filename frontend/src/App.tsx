import { useState, useEffect } from 'react';
import type { Job, CreateJobInput, JobStatus } from './types';
import { getJobs, createJob, updateJob, deleteJob } from './api/jobs';
import JobForm from './components/JobForm';

const statusOrder: JobStatus[] = ['sent', 'interview', 'rejected', 'offer'];

const statusConfig = {
  sent:      { label: 'Sendt',     bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20' },
  interview: { label: 'Interview', bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  rejected:  { label: 'Afslag',   bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20' },
  offer:     { label: 'Tilbud',   bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20' },
};

const initials = (company: string) =>
  company.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const iconColors: Record<string, string> = {
  A: 'bg-blue-500/20 text-blue-400',
  B: 'bg-purple-500/20 text-purple-400',
  C: 'bg-teal-500/20 text-teal-400',
  D: 'bg-amber-500/20 text-amber-400',
  E: 'bg-red-500/20 text-red-400',
  F: 'bg-green-500/20 text-green-400',
  G: 'bg-pink-500/20 text-pink-400',
  H: 'bg-indigo-500/20 text-indigo-400',
  I: 'bg-orange-500/20 text-orange-400',
  J: 'bg-cyan-500/20 text-cyan-400',
};

const getIconColor = (company: string) =>
  iconColors[company[0]?.toUpperCase()] ?? 'bg-slate-500/20 text-slate-400';

type Filter = JobStatus | 'all';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

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
    const next = statusOrder[(statusOrder.indexOf(job.status) + 1) % statusOrder.length];
    const updated = await updateJob(job.id, { ...job, status: next });
    setJobs(jobs.map((j) => (j.id === job.id ? updated : j)));
  };

  const counts = {
    sent:      jobs.filter((j) => j.status === 'sent').length,
    interview: jobs.filter((j) => j.status === 'interview').length,
    offer:     jobs.filter((j) => j.status === 'offer').length,
    rejected:  jobs.filter((j) => j.status === 'rejected').length,
  };

  const filtered = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Job Tracker</h1>
            <p className="text-sm text-gray-500 mt-1">{jobs.length} ansøgninger i alt</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <span>+</span> Tilføj ansøgning
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {([
            { key: 'sent',      label: 'Sendt',     color: 'text-blue-400' },
            { key: 'interview', label: 'Interview',  color: 'text-amber-400' },
            { key: 'offer',     label: 'Tilbud',    color: 'text-green-400' },
            { key: 'rejected',  label: 'Afslag',    color: 'text-red-400' },
          ] as const).map(({ key, label, color }) => (
            <div key={key} className="bg-[#1a1d27] rounded-xl p-4 border border-white/5">
              <div className={`text-2xl font-semibold ${color}`}>{counts[key]}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-5">
          {(['all', 'sent', 'interview', 'offer', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filter === s
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-transparent text-gray-400 border-white/10 hover:border-white/20'
              }`}
            >
              {s === 'all' ? 'Alle' : statusConfig[s].label}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-lg">Ingen ansøgninger endnu</p>
            <p className="text-sm mt-1">Klik på "Tilføj ansøgning" for at starte</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((job) => {
              const cfg = statusConfig[job.status];
              return (
                <div
                  key={job.id}
                  className="bg-[#1a1d27] border border-white/5 rounded-xl px-5 py-4 flex items-center justify-between hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 ${getIconColor(job.company)}`}>
                      {initials(job.company)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-100">
                        {job.job_url ? (
                          <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
                            {job.company}
                          </a>
                        ) : job.company}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{job.position}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStatusChange(job)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-opacity hover:opacity-80 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      {cfg.label}
                    </button>
                    <span className="text-xs text-gray-600">
                      {new Date(job.applied_date).toLocaleDateString('da-DK')}
                    </span>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-gray-700 hover:text-red-400 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <JobForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}
    </div>
  );
}