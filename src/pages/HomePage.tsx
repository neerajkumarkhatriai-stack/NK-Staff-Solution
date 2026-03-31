import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { JobListing, JobRole, ExperienceRange } from '../types';
import { jobService } from '../services/jobService';
import { JobCard } from '../components/JobCard';
import { Filters } from '../components/Filters';
import { Briefcase, MapPin, Search, Loader2, Plus } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<JobRole | 'All'>('All');
  const [experience, setExperience] = useState<ExperienceRange | 'All'>('All');

  useEffect(() => {
    const unsubscribe = jobService.subscribeToJobs((data) => {
      setJobs(data);
      setLoading(false);
    });
    return () => unsubscribe();
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

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Find Your Next <span className="text-orange-600">Non IT Job</span> in Delhi NCR
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Connecting candidates with the best Non IT opportunities in Sales, HR, Admin, Finance, and more within a 150KM radius of Delhi.
          </p>
          {user?.email === 'neerajkumarkhatri.ai@gmail.com' && (
            <div className="mb-12">
              <Link 
                to="/admin" 
                className="inline-flex items-center bg-orange-600 text-white px-8 py-4 rounded-2xl hover:bg-orange-700 transition-all text-lg font-bold shadow-xl shadow-orange-100"
              >
                <Plus className="w-6 h-6 mr-2" />
                Post a New Job Listing
              </Link>
            </div>
          )}
          <div className="flex items-center justify-center space-x-6 text-sm font-medium text-gray-500">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-orange-600" />
              {jobs.length}+ Active Jobs
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-orange-600" />
              Delhi NCR & Nearby (150KM)
            </div>
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
              filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))
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
