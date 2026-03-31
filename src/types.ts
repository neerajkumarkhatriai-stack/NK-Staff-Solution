export type JobRole = 'Sales' | 'HR' | 'Admin' | 'Marketing' | 'Finance' | 'Logistics' | 'Operations' | 'Manager' | 'Other';
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

export interface InterviewSlot {
  date: string;
  time: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  currentCompany?: string;
  location?: string;
  experience?: string;
  currentCTC?: string;
  expectedCTC?: string;
  noticePeriod?: string;
  interviewSlots: InterviewSlot[];
  resumeUrl?: string;
  appliedAt: number;
}
