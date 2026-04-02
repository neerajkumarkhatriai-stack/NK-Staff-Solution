export type JobRole = 'Sales' | 'HR' | 'Admin' | 'Marketing' | 'Finance' | 'Logistics' | 'Operations' | 'Manager' | 'Other';
export type JobType = 'Full-time' | 'Contract' | 'Part-time';
export type ExperienceRange = '0-2' | '2-5' | '5+';
export type WorkType = 'On-site' | 'Remote' | 'Hybrid';
export type JobStatus = 'Published' | 'Internal' | 'Draft';

export interface JobListing {
  id: string;
  jobCode: string; // Unique human-readable ID
  title: string;
  company: string;
  location: string;
  salary?: string;
  experience: ExperienceRange;
  jobType: JobType;
  workType: WorkType;
  role: JobRole;
  department: string;
  openings: number;
  status: JobStatus;
  description: string;
  skills: string[];
  postedAt: number; // timestamp
  lastActivityAt: number; // timestamp
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

export type ApplicationStatus = 
  | 'Sourced' 
  | 'Applied' 
  | 'Phone Screen' 
  | 'Hiring Manager Interview' 
  | 'Offer' 
  | 'Hired' 
  | 'Rejected';

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
  status: ApplicationStatus;
  rejectionStage?: ApplicationStatus;
}
