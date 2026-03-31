export type JobRole = 'Operator' | 'Supervisor' | 'Engineer' | 'Technician' | 'Manager' | 'Other';
export type JobType = 'Full-time' | 'Contract' | 'Part-time';
export type ExperienceRange = '0-2' | '2-5' | '5+';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  experience: ExperienceRange;
  jobType: JobType;
  role: JobRole;
  description: string;
  skills: string[];
  postedAt: number; // timestamp
  contactEmail?: string;
  contactPhone?: string;
  hrName?: string;
  applyLink?: string;
}

export interface JobAlert {
  email?: string;
  phone?: string;
  keywords?: string[];
  createdAt: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  resumeUrl?: string;
  appliedAt: number;
}
