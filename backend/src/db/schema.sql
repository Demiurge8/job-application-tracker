CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  company VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'sent' 
    CHECK (status IN ('sent', 'interview', 'rejected', 'offer')),
  applied_date DATE NOT NULL,
  notes TEXT,
  job_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);