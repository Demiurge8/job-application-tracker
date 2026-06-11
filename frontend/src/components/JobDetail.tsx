import type { Job } from '../types';

const statusConfig = {
  sent:      { label: 'Sendt',    bg: 'bg-blue-500/10',  text: 'text-blue-400',  border: 'border-blue-500/20' },
  interview: { label: 'Interview',bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  rejected:  { label: 'Afslag',  bg: 'bg-red-500/10',   text: 'text-red-400',   border: 'border-red-500/20' },
  offer:     { label: 'Tilbud',  bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
};

const iconColors: Record<string, string> = {
  A:'bg-blue-500/20 text-blue-400', B:'bg-purple-500/20 text-purple-400',
  C:'bg-teal-500/20 text-teal-400', D:'bg-amber-500/20 text-amber-400',
  E:'bg-red-500/20 text-red-400',   F:'bg-green-500/20 text-green-400',
  G:'bg-pink-500/20 text-pink-400', H:'bg-indigo-500/20 text-indigo-400',
  I:'bg-orange-500/20 text-orange-400', J:'bg-cyan-500/20 text-cyan-400',
  K:'bg-rose-500/20 text-rose-400', L:'bg-violet-500/20 text-violet-400',
  M:'bg-sky-500/20 text-sky-400',   N:'bg-emerald-500/20 text-emerald-400',
  O:'bg-yellow-500/20 text-yellow-400', P:'bg-lime-500/20 text-lime-400',
  R:'bg-fuchsia-500/20 text-fuchsia-400', S:'bg-blue-400/20 text-blue-300',
  T:'bg-purple-400/20 text-purple-300', U:'bg-teal-400/20 text-teal-300',
  V:'bg-orange-400/20 text-orange-300', W:'bg-pink-400/20 text-pink-300',
  X:'bg-indigo-400/20 text-indigo-300', Y:'bg-cyan-400/20 text-cyan-300',
  Z:'bg-green-400/20 text-green-300',
};

const getIconColor = (c: string) => iconColors[c[0]?.toUpperCase()] ?? 'bg-slate-500/20 text-slate-400';
const initials = (c: string) => c.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

interface Props {
  job: Job;
  onClose: () => void;
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
}

export default function JobDetail({ job, onClose, onEdit, onDelete }: Props) {
  const cfg = statusConfig[job.status];
  return (
    <div className="animate-slide-in fixed top-0 right-0 h-full w-80 border-l border-white/5 z-30 flex flex-col" style={{ background: '#13151f' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Detaljer</span>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-400 transition-colors">x</button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 ${getIconColor(job.company)}`}>
            {initials(job.company)}
          </div>
          <div>
            <div className="text-base font-semibold text-gray-100">{job.company}</div>
            <div className="text-sm text-gray-500 mt-0.5">{job.position}</div>
          </div>
        </div>
        <div className="flex flex-col rounded-xl overflow-hidden border border-white/5 mb-5">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5" style={{ background: '#1a1d27' }}>
            <span className="text-xs text-gray-500">Status</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>{cfg.label}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5" style={{ background: '#1a1d27' }}>
            <span className="text-xs text-gray-500">Dato</span>
            <span className="text-xs text-gray-300">{new Date(job.applied_date).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          {job.job_url && (
            <div className="flex items-center justify-between px-4 py-3" style={{ background: '#1a1d27' }}>
              <span className="text-xs text-gray-500">Link</span>
              <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Abn jobopslag</a>
            </div>
          )}
        </div>
        {job.notes && (
          <div className="mb-5">
            <div className="text-xs text-gray-500 font-medium mb-2">Noter</div>
            <div className="rounded-xl px-4 py-3 text-sm text-gray-400 leading-relaxed border border-white/5" style={{ background: '#1a1d27' }}>{job.notes}</div>
          </div>
        )}
        <div className="text-xs text-gray-700 space-y-1">
          <div>Oprettet: {new Date(job.created_at).toLocaleDateString('da-DK')}</div>
          <div>Opdateret: {new Date(job.updated_at).toLocaleDateString('da-DK')}</div>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-white/5 flex gap-2">
        <button onClick={() => onEdit(job)} className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/20 rounded-lg py-2 text-sm font-medium transition-colors">Rediger</button>
        <button onClick={() => onDelete(job.id)} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg py-2 text-sm font-medium transition-colors">Slet</button>
      </div>
    </div>
  );
}