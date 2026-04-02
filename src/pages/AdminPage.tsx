import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { jobService } from '../services/jobService';
import { JobListing, JobApplication, ApplicationStatus } from '../types';
import { 
  Plus, Edit2, Trash2, Users, Briefcase, 
  ChevronRight, LayoutDashboard, Loader2, Search, X, Globe,
  Phone, MapPin, User, Mail, Building, IndianRupee, Clock, Calendar, ExternalLink, FileText,
  MoreVertical, BarChart3
} from 'lucide-react';
import { AdminJobForm } from '../components/AdminJobForm';
import { ApplicationDetails } from '../components/ApplicationDetails';
import { RejectionModal } from '../components/RejectionModal';
import { JobReportModal } from '../components/JobReportModal';
import { formatDistanceToNow } from 'date-fns';

export const AdminPage: React.FC = () => {
  const [user, loadingAuth] = useAuthState(auth);
  const isAdmin = user?.email === 'neerajkumarkhatri.ai@gmail.com';
  const [activeTab, setActiveTab] = useState<'jobs' | 'hiring_plan'>('jobs');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [rejectionModalApp, setRejectionModalApp] = useState<JobApplication | null>(null);
  const [reportJob, setReportJob] = useState<JobListing | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All departments');
  const [selectedLocation, setSelectedLocation] = useState('All locations');
  const [includeDrafts, setIncludeDrafts] = useState(false);

  // Candidate View State
  const [candidateView, setCandidateView] = useState<{ jobId: string; stage: ApplicationStatus } | null>(null);

  useEffect(() => {
    if (user) {
      const unsubJobs = jobService.subscribeToJobs(setJobs);
      const unsubApps = jobService.subscribeToApplications(setApplications);
      setLoading(false);
      return () => {
        unsubJobs();
        unsubApps();
      };
    }
  }, [user]);

  const handleSeedData = async () => {
    if (window.confirm('This will add 5 sample jobs and 50+ applications to the database. Continue?')) {
      const sampleJobs: Omit<JobListing, 'id'>[] = [
        {
          jobCode: 'JOB-SUPP1',
          title: 'Customer Support Representative',
          company: 'Workable Customer Enablement',
          location: 'Berlin, Germany',
          department: 'Support',
          openings: 3,
          status: 'Published',
          workType: 'On-site',
          salary: '€40,000 - €50,000',
          experience: '0-2',
          jobType: 'Full-time',
          role: 'Other',
          description: 'Help our customers succeed with our platform.',
          skills: ['Customer Support', 'Zendesk', 'Communication'],
          postedAt: Date.now() - 15 * 86400000,
          lastActivityAt: Date.now(),
          contactPhone: '9876543210'
        },
        {
          jobCode: 'JOB-SALE1',
          title: 'Account Executive',
          company: 'Workable Sales',
          location: 'London, United Kingdom',
          department: 'Sales',
          openings: 2,
          status: 'Published',
          workType: 'On-site',
          salary: '£60,000 - £80,000',
          experience: '2-5',
          jobType: 'Full-time',
          role: 'Sales',
          description: 'Drive revenue growth by acquiring new customers.',
          skills: ['Sales', 'Negotiation', 'CRM'],
          postedAt: Date.now() - 30 * 86400000,
          lastActivityAt: Date.now() - 5 * 86400000,
          contactEmail: 'sales@workable.com'
        },
        {
          jobCode: 'JOB-MKTG1',
          title: 'Growth Marketing Manager',
          company: 'Workable Marketing',
          location: 'Remote',
          department: 'Marketing',
          openings: 1,
          status: 'Published',
          workType: 'Remote',
          salary: '$90,000 - $120,000',
          experience: '5+',
          jobType: 'Full-time',
          role: 'Marketing',
          description: 'Lead our growth initiatives across all channels.',
          skills: ['SEO', 'PPC', 'Analytics'],
          postedAt: Date.now() - 7 * 86400000,
          lastActivityAt: Date.now(),
          contactEmail: 'marketing@workable.com'
        },
        {
          jobCode: 'JOB-HR001',
          title: 'HR Generalist',
          company: 'Workable People',
          location: 'Delhi NCR',
          department: 'HR',
          openings: 1,
          status: 'Published',
          workType: 'Hybrid',
          salary: '₹6,00,000 - ₹8,00,000',
          experience: '2-5',
          jobType: 'Full-time',
          role: 'HR',
          description: 'Manage end-to-end HR operations.',
          skills: ['Recruitment', 'Payroll', 'Employee Relations'],
          postedAt: Date.now() - 3 * 86400000,
          lastActivityAt: Date.now(),
          contactEmail: 'hr@workable.com'
        },
        {
          jobCode: 'JOB-OPS02',
          title: 'Logistics Coordinator',
          company: 'Workable Logistics',
          location: 'Mumbai',
          department: 'Operations',
          openings: 5,
          status: 'Published',
          workType: 'On-site',
          salary: '₹4,00,000 - ₹6,00,000',
          experience: '0-2',
          jobType: 'Full-time',
          role: 'Logistics',
          description: 'Coordinate daily logistics and supply chain activities.',
          skills: ['Supply Chain', 'Inventory Management', 'Excel'],
          postedAt: Date.now() - 45 * 86400000,
          lastActivityAt: Date.now() - 10 * 86400000,
          contactEmail: 'ops@workable.com'
        }
      ];

      try {
        const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikram Singh', 'Anjali Verma', 'Deepak Reddy', 'Kavita Iyer', 'Sanjay Mehra', 'Pooja Jain'];
        const statuses: ApplicationStatus[] = ['Sourced', 'Applied', 'Phone Screen', 'Hiring Manager Interview', 'Offer', 'Hired', 'Rejected'];

        for (const jobData of sampleJobs) {
          const jobId = await jobService.addJob(jobData);
          if (!jobId) continue;

          // Add 10-15 applications per job
          const appCount = 10 + Math.floor(Math.random() * 6);
          for (let i = 0; i < appCount; i++) {
            const name = names[Math.floor(Math.random() * names.length)] + ' ' + (i + 1);
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            await jobService.submitApplication({
              jobId,
              jobTitle: jobData.title,
              company: jobData.company,
              applicantName: name,
              applicantPhone: '987654321' + i,
              applicantEmail: name.toLowerCase().replace(' ', '.') + '@example.com',
              appliedAt: jobData.postedAt + (Math.random() * (Date.now() - jobData.postedAt)),
              status,
              interviewSlots: [
                { date: '2026-04-10', time: '10:00' },
                { date: '2026-04-11', time: '14:00' },
                { date: '2026-04-12', time: '16:00' }
              ]
            });
          }
        }
        alert('Sample data with applications added successfully!');
      } catch (error) {
        console.error('Seeding failed', error);
        alert('Failed to add sample data.');
      }
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      try {
        await jobService.deleteJob(id);
      } catch (error) {
        console.error('Delete failed', error);
        alert('Failed to delete job.');
      }
    }
  };

  const handleDuplicateJob = async (job: JobListing) => {
    try {
      const { id, ...jobData } = job;
      await jobService.addJob({
        ...jobData,
        title: `${jobData.title} (Copy)`,
        postedAt: Date.now(),
        lastActivityAt: Date.now()
      });
      alert('Job duplicated successfully!');
    } catch (error) {
      console.error('Duplicate failed', error);
      alert('Failed to duplicate job.');
    }
  };

  const handleStatusUpdate = async (appId: string, newStatus: ApplicationStatus, rejectionStage?: ApplicationStatus) => {
    try {
      await jobService.updateApplicationStatus(appId, newStatus, rejectionStage);
    } catch (error) {
      console.error('Status update failed', error);
      alert('Failed to update status.');
    }
  };

  const pipelineStages: ApplicationStatus[] = [
    'Sourced', 'Applied', 'Phone Screen', 'Hiring Manager Interview', 'Offer', 'Hired'
  ];

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Sourced': return 'text-blue-600';
      case 'Applied': return 'text-purple-600';
      case 'Phone Screen': return 'text-orange-600';
      case 'Hiring Manager Interview': return 'text-indigo-600';
      case 'Offer': return 'text-yellow-600';
      case 'Hired': return 'text-green-600';
      case 'Rejected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loadingAuth || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-gray-100 rounded-2xl p-12 inline-block shadow-sm">
          <LayoutDashboard className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
          <p className="text-gray-500 mb-8">Please login with an authorized account to access the dashboard.</p>
        </div>
      </div>
    );
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All departments' || job.department === selectedDept;
    const matchesLoc = selectedLocation === 'All locations' || job.location === selectedLocation;
    const matchesDraft = includeDrafts || job.status !== 'Draft';
    return matchesSearch && matchesDept && matchesLoc && matchesDraft;
  });

  const departments = Array.from(new Set(jobs.map(j => j.department)));
  const locations = Array.from(new Set(jobs.map(j => j.location)));

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Recruitment Dashboard</h1>
                <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
              </div>
              <nav className="flex space-x-4">
                <button 
                  onClick={() => { setActiveTab('jobs'); setCandidateView(null); }}
                  className={`px-3 py-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === 'jobs' && !candidateView ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Jobs
                </button>
                <button 
                  onClick={() => { setActiveTab('hiring_plan'); setCandidateView(null); }}
                  className={`px-3 py-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === 'hiring_plan' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Hiring Plan
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => { setEditingJob(null); setShowForm(true); }}
                className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-all text-sm font-bold"
              >
                Create a new job
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {candidateView ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCandidateView(null)}
                className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900"
              >
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                Back to Dashboard
              </button>
              <h2 className="text-xl font-bold text-gray-900">
                Candidates for {jobs.find(j => j.id === candidateView.jobId)?.title} - {candidateView.stage}
              </h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications
                    .filter(a => a.jobId === candidateView.jobId && a.status === candidateView.stage)
                    .map(app => (
                      <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{app.applicantName}</div>
                          {app.resumeUrl && (
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-600 hover:underline flex items-center mt-1">
                              <FileText className="w-3 h-3 mr-1" /> View Resume
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{app.applicantEmail}</div>
                          <div className="text-xs text-gray-500">{app.applicantPhone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(app.status)} bg-opacity-10`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button 
                            onClick={() => setSelectedApplication(app)}
                            className="text-xs font-bold text-gray-600 hover:text-orange-600"
                          >
                            Details
                          </button>
                          <select 
                            value={app.status}
                            onChange={(e) => handleStatusUpdate(app.id, e.target.value as ApplicationStatus)}
                            className="text-xs font-bold bg-transparent border-none focus:ring-0 cursor-pointer text-orange-600"
                          >
                            {pipelineStages.concat(['Rejected']).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'jobs' ? (
          <div className="space-y-8">
            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Start typing to search jobs..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                />
              </div>
              <select 
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="All departments">All departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select 
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="All locations">All locations</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <button className="text-sm font-medium text-gray-700 hover:text-gray-900">No group applied</button>
              <div className="flex items-center space-x-2 ml-auto">
                <input 
                  type="checkbox" 
                  id="drafts" 
                  checked={includeDrafts}
                  onChange={e => setIncludeDrafts(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="drafts" className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                  Include {jobs.filter(j => j.status === 'Draft').length} draft jobs
                </label>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {filteredJobs.map(job => {
                const jobApps = applications.filter(a => a.jobId === job.id);
                return (
                  <div key={job.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          <Plus className="w-4 h-4 text-gray-400 rotate-45" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider">
                              {job.jobCode}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center">
                            {job.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                            <span>{job.department}</span>
                            <span>•</span>
                            <span>{job.workType}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span className="text-teal-600">{job.openings} requisition{job.openings !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                        <div className="flex items-center space-x-3">
                          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">
                            Find Candidates
                          </button>
                          <div className="relative group">
                            <button className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold text-white transition-all ${
                              job.status === 'Published' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-gray-500 hover:bg-gray-600'
                            }`}>
                              {job.status === 'Published' ? 'Published' : 'Used Internally'}
                              <ChevronRight className="w-4 h-4 ml-2 rotate-90" />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
                              <button 
                                onClick={() => jobService.updateJob(job.id, { status: 'Published' })}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                              >
                                Published
                              </button>
                              <button 
                                onClick={() => jobService.updateJob(job.id, { status: 'Internal' })}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                              >
                                Internal
                              </button>
                              <button 
                                onClick={() => jobService.updateJob(job.id, { status: 'Draft' })}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                              >
                                Draft
                              </button>
                            </div>
                          </div>
                          <div className="relative group">
                            <button className="p-2 text-gray-400 hover:text-gray-900">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
                              <button 
                                onClick={() => { setEditingJob(job); setShowForm(true); }}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                              >
                                <Edit2 className="w-4 h-4 mr-2" /> Edit Job
                              </button>
                              <button 
                                onClick={() => {
                                  const url = `${window.location.origin}/apply/${job.id}?source=external`;
                                  navigator.clipboard.writeText(url);
                                  alert('External application link copied to clipboard!');
                                }}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" /> Copy External Link
                              </button>
                              <button 
                                onClick={() => setReportJob(job)}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                              >
                                <BarChart3 className="w-4 h-4 mr-2" /> View Report
                              </button>
                              <button 
                                onClick={() => handleDuplicateJob(job)}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                              >
                                <Plus className="w-4 h-4 mr-2" /> Duplicate Job
                              </button>
                              <button 
                                onClick={() => handleDeleteJob(job.id)}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center"
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Job
                              </button>
                            </div>
                          </div>
                        </div>
                    </div>

                    {/* Pipeline Metrics */}
                    <div className="grid grid-cols-6 border-y border-gray-100 py-4 mb-4">
                      {pipelineStages.map((stage, idx) => {
                        const count = jobApps.filter(a => a.status === stage).length;
                        return (
                          <button 
                            key={stage}
                            onClick={() => setCandidateView({ jobId: job.id, stage })}
                            className={`flex flex-col items-center justify-center group ${idx !== 5 ? 'border-r border-gray-100' : ''}`}
                          >
                            <span className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {count || '-'}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1 group-hover:text-gray-600 transition-colors">
                              {stage}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Footer Info */}
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <div className="flex items-center">
                        {job.status === 'Published' ? (
                          <>
                            <Globe className="w-4 h-4 text-teal-500 mr-2" />
                            <span>Automatically posted to <span className="text-teal-600 font-bold">8 free portals</span> and your careers page</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 text-red-500 mr-2" />
                            <span>This job is not published on your careers page or on any job boards</span>
                          </>
                        )}
                      </div>
                      <div>
                        Candidates: {jobApps.length} total • {jobApps.filter(a => a.status !== 'Rejected' && a.status !== 'Hired').length} active in pipeline • Last activity: {jobApps.length > 0 ? formatDistanceToNow(Math.max(...jobApps.map(a => a.appliedAt))) + ' ago' : 'N/A'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl">
            <Calendar className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">Hiring Plan View</h3>
            <p className="text-gray-500">This view is currently under development. Track your team's growth and budget here.</p>
          </div>
        )}
      </div>
      {selectedApplication && (
        <ApplicationDetails 
          application={selectedApplication} 
          onClose={() => setSelectedApplication(null)} 
        />
      )}

      {rejectionModalApp && (
        <RejectionModal 
          application={rejectionModalApp}
          onClose={() => setRejectionModalApp(null)}
          onConfirm={(reason, stage) => {
            handleStatusUpdate(rejectionModalApp.id, 'Rejected', stage);
            setRejectionModalApp(null);
          }}
        />
      )}

      {reportJob && (
        <JobReportModal 
          job={reportJob}
          applications={applications.filter(a => a.jobId === reportJob.id)}
          onClose={() => setReportJob(null)}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingJob ? 'Edit Job Listing' : 'Post New Job'}
                </h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <AdminJobForm 
                initialData={editingJob || undefined} 
                onSuccess={() => setShowForm(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
