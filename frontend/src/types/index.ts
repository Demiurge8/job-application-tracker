export type JobStatus = 'sent' | 'interview' | 'rejected' | 'offer';

export interface Job {
  id: number;
  company: string;
  position: string;
  status: JobStatus;
  applied_date: string;
  notes?: string;
  job_url?: string;
  created_at: string;
  updated_at: string;
}

export type CreateJobInput = Omit<Job, 'id' | 'created_at' | 'updated_at'>;