import React, { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { JobListing, JobApplication } from '../types';
import { 
  BarChart3, TrendingUp, Users, CheckCircle2, 
  XCircle, Clock, ArrowUpRight, ArrowDownRight, 
  Activity, ShieldCheck, AlertCircle, Search
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export const ReportsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubJobs = jobService.subscribeToJobs(setJobs);
    const unsubApps = jobService.subscribeToApplications(setApplications);
    setLoading(false);
    return () => {
      unsubJobs();
      unsubApps();
    };
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.jobCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getJobHealth = (job: JobListing) => {
    const jobApps = applications.filter(a => a.jobId === job.id);
    const total = jobApps.length;
    if (total === 0) return { status: 'Critical', color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle, message: 'No applicants yet' };
    
    const hired = jobApps.filter(a => a.status === 'Hired').length;
    const qualified = jobApps.filter(a => !['Applied', 'Sourced', 'Rejected'].includes(a.status)).length;
    const qualificationRate = (qualified / total) * 100;
    
    if (hired >= job.openings) return { status: 'Fulfilled', color: 'text-teal-600', bg: 'bg-teal-50', icon: ShieldCheck, message: 'All positions filled' };
    if (qualificationRate > 40) return { status: 'Healthy', color: 'text-green-600', bg: 'bg-green-50', icon: Activity, message: 'High quality pipeline' };
    if (qualificationRate > 20) return { status: 'Stable', color: 'text-blue-600', bg: 'bg-blue-50', icon: Activity, message: 'Steady progress' };
    
    return { status: 'At Risk', color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle, message: 'Low qualification rate' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Hiring Health Reports</h1>
            <p className="text-gray-500 font-medium">Monitor pipeline performance and job health metrics across your organization.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by job title or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl w-full md:w-80 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Active Jobs', value: jobs.filter(j => j.status === 'Published').length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Applicants', value: applications.length, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Hires This Month', value: applications.filter(a => a.status === 'Hired').length, icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
            { label: 'Avg. Conversion', value: applications.length > 0 ? Math.round((applications.filter(a => a.status === 'Hired').length / applications.length) * 100) + '%' : '0%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Job Health Table */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Job Performance Index</h3>
            <div className="flex items-center space-x-4 text-xs font-bold text-gray-400">
              <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-teal-500 mr-2"></div> Healthy</div>
              <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div> At Risk</div>
              <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div> Critical</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pipeline Health</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Volume</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Conversion</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredJobs.map(job => {
                  const health = getJobHealth(job);
                  const jobApps = applications.filter(a => a.jobId === job.id);
                  const hired = jobApps.filter(a => a.status === 'Hired').length;
                  const conversion = jobApps.length > 0 ? Math.round((hired / jobApps.length) * 100) : 0;
                  
                  return (
                    <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl ${health.bg} ${health.color} flex items-center justify-center`}>
                            <health.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{job.title}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{job.jobCode} • {job.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${health.color} ${health.bg} border border-current border-opacity-10`}>
                          {health.status}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 font-medium">{health.message}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-gray-900">{jobApps.length}</span>
                          <span className="text-xs text-gray-400 font-medium">applicants</span>
                        </div>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${health.status === 'Critical' ? 'bg-red-500' : 'bg-orange-500'}`} 
                            style={{ width: `${Math.min((jobApps.length / 20) * 100, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-bold text-gray-900">{conversion}%</span>
                          {conversion > 10 ? (
                            <ArrowUpRight className="w-3 h-3 text-teal-500" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-500" />
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hire Rate</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-bold text-gray-600">
                          {jobApps.length > 0 
                            ? formatDistanceToNow(Math.max(...jobApps.map(a => a.appliedAt))) + ' ago'
                            : 'No activity'}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          Posted {format(job.postedAt, 'MMM d, yyyy')}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Briefcase = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);
