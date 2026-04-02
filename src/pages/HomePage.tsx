import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { JobListing, JobRole, ExperienceRange, JobApplication } from '../types';
import { jobService } from '../services/jobService';
import { JobCard } from '../components/JobCard';
import { Filters } from '../components/Filters';
import { Briefcase, MapPin, Search, Loader2, Plus, Users, TrendingUp, BarChart3 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<JobRole | 'All'>('All');
  const [experience, setExperience] = useState<ExperienceRange | 'All'>('All');

  useEffect(() => {
    const unsubJobs = jobService.subscribeToJobs((data) => {
      setJobs(data);
      if (applications.length > 0) setLoading(false);
    });
    const unsubApps = jobService.subscribeToApplications((data) => {
      setApplications(data);
      setLoading(false);
    });
    return () => {
      unsubJobs();
      unsubApps();
    };
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = role === 'All' || job.role === role;
    const matchesExperience = experience === 'All' || job.experience === experience;

    return matchesSearch && matchesRole && matchesExperience;
  });

  const stats = {
    openJobs: jobs.filter(j => j.status === 'Published').length,
    totalCandidates: applications.length,
    hiredCount: applications.filter(a => a.status === 'Hired').length,
    sourcedCount: applications.filter(a => a.status === 'Sourced').length
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Section with Stats */}
      <div className="bg-white border-b border-gray-100 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Talent Acquisition <span className="text-orange-600">Dashboard</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real-time recruitment metrics and job performance tracking for Delhi NCR's Non IT sector.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Open Jobs', value: stats.openJobs, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Total Candidates', value: stats.totalCandidates, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Hired', value: stats.hiredCount, icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
              { label: 'Sourced', value: stats.sourcedCount, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 text-center">
                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {user?.email === 'neerajkumarkhatri.ai@gmail.com' && (
              <>
                <Link 
                  to="/admin" 
                  className="inline-flex items-center bg-orange-600 text-white px-8 py-4 rounded-2xl hover:bg-orange-700 transition-all text-lg font-bold shadow-xl shadow-orange-100"
                >
                  <Plus className="w-6 h-6 mr-2" />
                  Post a New Job
                </Link>
                <Link 
                  to="/reports" 
                  className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition-all text-lg font-bold shadow-xl shadow-gray-200"
                >
                  <BarChart3 className="w-6 h-6 mr-2" />
                  View Detailed Reports
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <Filters 
          search={search} setSearch={setSearch}
          role={role} setRole={setRole}
          experience={experience} setExperience={setExperience}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Fetching latest jobs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => {
                const jobApps = applications.filter(a => a.jobId === job.id);
                return (
                  <div key={job.id} className="relative group">
                    <JobCard job={job} />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-black text-gray-900">{jobApps.length}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="bg-white border border-gray-100 rounded-2xl p-12 inline-block shadow-sm">
                  <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search keywords.</p>
                  <button 
                    onClick={() => { setSearch(''); setRole('All'); setExperience('All'); }}
                    className="mt-6 text-orange-600 font-semibold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CheckCircle2 = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);
