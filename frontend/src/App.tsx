import { useState, useEffect, useCallback } from 'react';
import type { Job, CreateJobInput, JobStatus } from './types';
import { getJobs, createJob, updateJob, deleteJob } from './api/jobs';
import JobForm from './components/JobForm';
import Toast from './components/Toast';

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
  K: 'bg-rose-500/20 text-rose-400',
  L: 'bg-violet-500/20 text-violet-400',
  M: 'bg-sky-500/20 text-sky-400',
  N: 'bg-emerald-500/20 text-emerald-400',
  O: 'bg-yellow-500/20 text-yellow-400',
  P: 'bg-lime-500/20 text-lime-400',
  R: 'bg-fuchsia-500/20 text-fuchsia-400',
  S: 'bg-blue-400/20 text-blue-300',
  T: 'bg-purple-400/20 text-purple-300',
  U: 'bg-teal-400/20 text-teal-300',
  V: 'bg-orange-400/20 text-orange-300',
  W: 'bg-pink-400/20 text-pink-300',
  X: 'bg-indigo-400/20 text-indigo-300',
  Y: 'bg-cyan-400/20 text-cyan-300',
  Z: 'bg-green-400/20 text-green-300',
};

const getIconColor = (company: string) =>
  iconColors[company[0]?.toUpperCase()] ?? 'bg-slate-500/20 text-slate-400';

type Filter = JobStatus | 'all';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobs(data);
    } catch {
      showToast('Kunne ikke forbinde til serveren.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowForm(false);
        setEditJob(null);
        setDeleteConfirm(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleCreate = async (input: CreateJobInput) => {
    try {
      const newJob = await createJob(input);
      setJobs([newJob, ...jobs]);
      setShowForm(false);
      showToast('Ansøgning tilføjet!', 'success');
    } catch {
      showToast('Kunne ikke oprette ansøgning.', 'error');
    }
  };

  const handleEdit = async (input: CreateJobInput) => {
    if (!editJob) return;
    try {
      const updated = await updateJob(editJob.id, input);
      setJobs(jobs.map((j) => (j.id === editJob.id ? updated : j)));
      setEditJob(null);
      showToast('Ansøgning opdateret!', 'success');
    } catch {
      showToast('Kunne ikke opdatere ansøgning.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteJob(id);
      setJobs(jobs.filter((j) => j.id !== id));
      setDeleteConfirm(null);
      showToast('Ansøgning slettet.', 'success');
    } catch {
      showToast('Kunne ikke slette ansøgning.', 'error');
    }
  };

  const handleStatusChange = async (job: Job) => {
    try {
      const next = statusOrder[(statusOrder.indexOf(job.status) + 1) % statusOrder.length];
      const updated = await updateJob(job.id, { ...job, status: next });
      setJobs(jobs.map((j) => (j.id === job.id ? updated : j)));
      showToast(`Status ændret til ${statusConfig[next].label}`, 'success');
    } catch {
      showToast('Kunne ikke opdatere status.', 'error');
    }
  };

  const counts = {
    sent:      jobs.filter((j) => j.status === 'sent').length,
    interview: jobs.filter((j) => j.status === 'interview').length,
    offer:     jobs.filter((j) => j.status === 'offer').length,
    rejected:  jobs.filter((j) => j.status === 'rejected').length,
  };

  const filtered = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);

  const cardStyle = { background: '#1a1d27', borderColor: 'rgba(255,255,255,0.05)', transition: 'background 0.15s ease, border-color 0.15s ease' };
  const cardHoverIn = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = '#252840';
    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
  };
  const cardHoverOut = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = '#1a1d27';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
  };

  return (
    <div className="min-h-screen text-white w-full" style={{ background: '#0f1117' }}>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5" style={{ background: 'rgba(15,17,23,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold tracking-tight">Job Tracker</h1>
            <span className="text-xs text-gray-600 border border-white/10 px-2 py-0.5 rounded-full">{jobs.length}</span>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            + Tilføj
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Stats — клікабельні як фільтри */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {([
            { key: 'all',       label: 'Alle',      count: jobs.length,      color: 'text-gray-300',  activeColor: 'border-gray-400/40' },
            { key: 'sent',      label: 'Sendt',     count: counts.sent,      color: 'text-blue-400',  activeColor: 'border-blue-400/40' },
            { key: 'interview', label: 'Interview',  count: counts.interview, color: 'text-amber-400', activeColor: 'border-amber-400/40' },
            { key: 'offer',     label: 'Tilbud',    count: counts.offer,     color: 'text-green-400', activeColor: 'border-green-400/40' },
            { key: 'rejected',  label: 'Afslag',    count: counts.rejected,  color: 'text-red-400',   activeColor: 'border-red-400/40' },
          ] as const).map(({ key, label, count, color, activeColor }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-xl p-4 border text-left transition-all ${
                filter === key
                  ? `border-2 ${activeColor}`
                  : 'border-white/5 hover:border-white/10'
              }`}
              style={{ background: filter === key ? '#1e2133' : '#1a1d27' }}
            >
              <div className={`text-2xl font-semibold ${color}`}>{count}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-white/5 rounded-xl px-5 py-4 h-16 animate-pulse" style={{ background: '#1a1d27' }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-lg text-gray-500">Ingen ansøgninger endnu</p>
            <p className="text-sm mt-1 text-gray-600">Klik på "+ Tilføj" for at starte</p>
          </div>
        )}

        {/* Job Cards */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col gap-2">
            {filtered.map((job) => {
              const cfg = statusConfig[job.status];
              const isConfirming = deleteConfirm === job.id;
              return (
                <div
                  key={job.id}
                  style={cardStyle}
                  onMouseEnter={cardHoverIn}
                  onMouseLeave={cardHoverOut}
                  className="border rounded-xl px-5 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${getIconColor(job.company)}`}>
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
                      {job.notes && (
                        <div className="text-xs text-gray-600 mt-0.5 max-w-xs truncate" title={job.notes}>{job.notes}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStatusChange(job)}
                      title="Klik for at skifte status"
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-opacity hover:opacity-80 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      {cfg.label}
                    </button>
                    <span className="text-xs text-gray-600">
                      {new Date(job.applied_date).toLocaleDateString('da-DK')}
                    </span>
                    <button
                      onClick={() => setEditJob(job)}
                      className="text-gray-600 hover:text-indigo-400 transition-colors text-sm"
                      title="Rediger"
                    >
                      ✎
                    </button>
                    {isConfirming ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-xs bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 px-2 py-0.5 rounded transition-colors font-medium"
                        >
                          Slet
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs text-gray-600 hover:text-gray-400 px-1 transition-colors"
                        >
                          Nej
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(job.id)}
                        className="text-gray-700 hover:text-red-400 transition-colors text-sm"
                        title="Slet"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && <JobForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
      {editJob && <JobForm onSubmit={handleEdit} onCancel={() => setEditJob(null)} initialData={editJob} />}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}