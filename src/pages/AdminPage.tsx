import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { jobService } from '../services/jobService';
import { JobListing, JobApplication } from '../types';
import { 
  Plus, Edit2, Trash2, Users, Briefcase, 
  ChevronRight, LayoutDashboard, Loader2, Search, X,
  Phone, MapPin, User, Mail, Building, IndianRupee, Clock, Calendar, ExternalLink, FileText
} from 'lucide-react';
import { AdminJobForm } from '../components/AdminJobForm';
import { formatDistanceToNow } from 'date-fns';

export const AdminPage: React.FC = () => {
  const [user, loadingAuth] = useAuthState(auth);
  const isAdmin = user?.email === 'neerajkumarkhatri.ai@gmail.com';
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

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

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      try {
        await jobService.deleteJob(id);
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const handleSeedData = async () => {
    if (window.confirm('This will add 12 sample manufacturing jobs to the database. Continue?')) {
      const sampleJobs: Omit<JobListing, 'id'>[] = [
        {
          title: 'CNC Machine Operator',
          company: 'Precision Auto Parts Ltd',
          location: 'Sonipat, Haryana',
          salary: '₹18,000 - ₹22,000',
          experience: '0-2',
          jobType: 'Full-time',
          role: 'Operator',
          description: 'Looking for a skilled CNC Machine Operator to handle precision parts manufacturing. Must be able to read technical drawings and operate Fanuc/Siemens controllers.',
          skills: ['CNC Operation', 'Fanuc', 'Technical Drawing', 'Quality Check'],
          postedAt: Date.now(),
          contactPhone: '9876543210'
        },
        {
          title: 'Quality Control Engineer',
          company: 'Global Steel Solutions',
          location: 'Rai Industrial Area, Sonipat',
          salary: '₹25,000 - ₹35,000',
          experience: '2-5',
          jobType: 'Full-time',
          role: 'Engineer',
          description: 'Responsible for maintaining quality standards in the production line. Knowledge of ISO 9001 and 7 QC tools is mandatory.',
          skills: ['ISO 9001', '7 QC Tools', 'Measurement Instruments', 'Report Writing'],
          postedAt: Date.now() - 86400000,
          contactEmail: 'hr@globalsteel.com'
        },
        {
          title: 'Production Supervisor',
          company: 'Modern Plastics Pvt Ltd',
          location: 'Kundli, Sonipat',
          salary: '₹30,000 - ₹40,000',
          experience: '5+',
          jobType: 'Full-time',
          role: 'Supervisor',
          description: 'Lead a team of 20+ operators. Ensure production targets are met with minimal wastage. Manage shift schedules and reporting.',
          skills: ['Team Leadership', 'Production Planning', 'Inventory Management', 'Safety Compliance'],
          postedAt: Date.now() - 172800000
        },
        {
          title: 'Maintenance Technician (Electrical)',
          company: 'Everest Industries',
          location: 'Sonipat, Haryana',
          salary: '₹20,000 - ₹28,000',
          experience: '2-5',
          jobType: 'Full-time',
          role: 'Technician',
          description: 'Handle electrical maintenance of heavy machinery. Troubleshooting PLCs and VFDs is a plus.',
          skills: ['Electrical Maintenance', 'PLC Troubleshooting', 'VFD', 'Wiring'],
          postedAt: Date.now() - 259200000
        },
        {
          title: 'VMC Programmer',
          company: 'Hindustan Tools & Dies',
          location: 'Murthal, Sonipat',
          salary: '₹28,000 - ₹35,000',
          experience: '2-5',
          jobType: 'Full-time',
          role: 'Engineer',
          description: 'Programming for VMC machines using Mastercam or Delcam. Setting up tools and fixtures.',
          skills: ['Mastercam', 'VMC Programming', 'Tool Setting', 'Fixture Design'],
          postedAt: Date.now() - 345600000
        },
        {
          title: 'Helper / Machine Assistant',
          company: 'Sunrise Packaging',
          location: 'Sonipat, Haryana',
          salary: '₹12,000 - ₹15,000',
          experience: '0-2',
          jobType: 'Contract',
          role: 'Operator',
          description: 'Assist machine operators in daily tasks. Loading/unloading material and keeping the workspace clean.',
          skills: ['Manual Labor', 'Punctuality', 'Basic Math'],
          postedAt: Date.now() - 432000000
        },
        {
          title: 'Plant Manager',
          company: 'Apex Fasteners Ltd',
          location: 'Sonipat, Haryana',
          salary: '₹60,000 - ₹80,000',
          experience: '5+',
          jobType: 'Full-time',
          role: 'Manager',
          description: 'Oversee entire plant operations. Strategic planning, budgeting, and stakeholder management.',
          skills: ['Operations Management', 'Budgeting', 'Strategic Planning', 'ERP'],
          postedAt: Date.now() - 518400000
        },
        {
          title: 'Tool Room In-charge',
          company: 'Techno Moulds',
          location: 'Rai, Sonipat',
          salary: '₹35,000 - ₹45,000',
          experience: '5+',
          jobType: 'Full-time',
          role: 'Supervisor',
          description: 'Manage tool room activities. Maintenance and repair of injection moulds.',
          skills: ['Mould Maintenance', 'Lathe Machine', 'Grinding', 'EDM'],
          postedAt: Date.now() - 604800000
        },
        {
          title: 'Mechanical Draftsman',
          company: 'Sonipat Engineering Works',
          location: 'Sonipat, Haryana',
          salary: '₹22,000 - ₹30,000',
          experience: '2-5',
          jobType: 'Full-time',
          role: 'Engineer',
          description: 'Create 2D and 3D models of machine parts using AutoCAD and SolidWorks.',
          skills: ['AutoCAD', 'SolidWorks', 'GD&T', 'Mechanical Design'],
          postedAt: Date.now() - 691200000
        },
        {
          title: 'Store Keeper',
          company: 'BakeWell Foods',
          location: 'Kundli, Sonipat',
          salary: '₹15,000 - ₹20,000',
          experience: '2-5',
          jobType: 'Full-time',
          role: 'Other',
          description: 'Manage raw material and finished goods inventory. Keep track of inward/outward movement.',
          skills: ['Inventory Management', 'Excel', 'Tally', 'Record Keeping'],
          postedAt: Date.now() - 777600000
        },
        {
          title: 'Lathe Machine Operator',
          company: 'Haryana Gears',
          location: 'Sonipat, Haryana',
          salary: '₹16,000 - ₹20,000',
          experience: '0-2',
          jobType: 'Full-time',
          role: 'Operator',
          description: 'Operation of manual lathe machines for gear manufacturing.',
          skills: ['Lathe Operation', 'Measurement', 'Gear Cutting'],
          postedAt: Date.now() - 864000000
        },
        {
          title: 'HR Executive (Manufacturing)',
          company: 'NK Staff Solution (Internal)',
          location: 'Sonipat, Haryana',
          salary: '₹20,000 - ₹25,000',
          experience: '0-2',
          jobType: 'Full-time',
          role: 'Manager',
          description: 'Handle recruitment, payroll, and compliance for manufacturing clients.',
          skills: ['Recruitment', 'Payroll', 'EPF/ESI', 'Labor Laws'],
          postedAt: Date.now() - 950400000
        }
      ];

      try {
        for (const job of sampleJobs) {
          await jobService.addJob(job);
        }
        alert('Sample data added successfully!');
      } catch (error) {
        console.error('Seeding failed', error);
        alert('Failed to add sample data.');
      }
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

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage job listings and view applications</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => { setEditingJob(null); setShowForm(true); }}
              className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all text-sm font-bold shadow-lg shadow-orange-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </button>
            <button 
              onClick={handleSeedData}
              className="text-xs font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-widest"
            >
              Seed Sample Data
            </button>
            <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
            <button 
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'jobs' 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Jobs ({jobs.length})
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'applications' 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Applications ({applications.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'jobs' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Active Job Listings</h2>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Job Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stats</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Posted</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.company} • {job.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          {applications.filter(a => a.jobId === job.id).length} applicants
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDistanceToNow(job.postedAt)} ago
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => { setEditingJob(job); setShowForm(true); }}
                          className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
            <div className="grid grid-cols-1 gap-4">
              {applications.map(app => (
                <div key={app.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-50 p-3 rounded-xl">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{app.applicantName}</h3>
                      <p className="text-sm text-gray-500 mb-2">Applied for <span className="text-orange-600 font-semibold">{app.jobTitle}</span> at {app.company}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {app.applicantPhone}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                          {app.experience || 'N/A'} Exp
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {app.location || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right hidden md:block">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Applied</p>
                      <p className="text-sm text-gray-900 font-medium">{formatDistanceToNow(app.appliedAt)} ago</p>
                    </div>
                    <button 
                      onClick={() => setSelectedApplication(app)}
                      className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                  <p className="text-gray-500 text-sm">Applied for {selectedApplication.jobTitle}</p>
                </div>
                <button 
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Personal & Professional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Info</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-3 text-orange-600" />
                        <span className="font-semibold text-gray-900">{selectedApplication.applicantName}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-3 text-gray-400" />
                        <a href={`tel:${selectedApplication.applicantPhone}`} className="hover:text-orange-600 underline">
                          {selectedApplication.applicantPhone}
                        </a>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-3 text-gray-400" />
                        <a href={`mailto:${selectedApplication.applicantEmail}`} className="hover:text-orange-600 underline">
                          {selectedApplication.applicantEmail}
                        </a>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-600">{selectedApplication.location || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Professional Info</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Briefcase className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-600">Exp: <span className="font-semibold text-gray-900">{selectedApplication.experience || 'N/A'}</span></span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Building className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-600">Company: <span className="font-semibold text-gray-900">{selectedApplication.currentCompany || 'N/A'}</span></span>
                      </div>
                      <div className="flex items-center text-sm">
                        <IndianRupee className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-600">Current CTC: <span className="font-semibold text-gray-900">{selectedApplication.currentCTC || 'N/A'}</span></span>
                      </div>
                      <div className="flex items-center text-sm">
                        <IndianRupee className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-600">Expected CTC: <span className="font-semibold text-gray-900">{selectedApplication.expectedCTC || 'N/A'}</span></span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-600">Notice: <span className="font-semibold text-gray-900">{selectedApplication.noticePeriod || 'N/A'}</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resume Section */}
                {selectedApplication.resumeUrl && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-orange-600" />
                      Candidate Resume
                    </h3>
                    <a 
                      href={selectedApplication.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 transition-all shadow-sm group"
                    >
                      <FileText className="w-5 h-5 mr-3 text-orange-600" />
                      View Resume File
                      <ExternalLink className="w-4 h-4 ml-3 text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </a>
                  </div>
                )}

                {/* Interview Slots */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                    Proposed Interview Slots
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedApplication.interviewSlots?.map((slot, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Slot {idx + 1}</p>
                        <p className="text-sm font-bold text-gray-900">{slot.date}</p>
                        <p className="text-xs text-gray-500">{slot.time}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => setSelectedApplication(null)}
                    className="px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
