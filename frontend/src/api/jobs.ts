import type { Job, CreateJobInput } from '../types';

const API_URL = 'http://localhost:3000/api/jobs';

export const getJobs = async (): Promise<Job[]> => {
  const res = await fetch(API_URL);
  return res.json();
};

export const createJob = async (job: CreateJobInput): Promise<Job> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  return res.json();
};

export const updateJob = async (id: number, job: CreateJobInput): Promise<Job> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  return res.json();
};

export const deleteJob = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};