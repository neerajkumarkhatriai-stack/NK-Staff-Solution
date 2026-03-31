import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { JobRole, ExperienceRange } from '../types';

interface FiltersProps {
  search: string;
  setSearch: (s: string) => void;
  role: JobRole | 'All';
  setRole: (r: JobRole | 'All') => void;
  experience: ExperienceRange | 'All';
  setExperience: (e: ExperienceRange | 'All') => void;
}

export const Filters: React.FC<FiltersProps> = ({
  search, setSearch, role, setRole, experience, setExperience
}) => {
  const roles: (JobRole | 'All')[] = ['All', 'Operator', 'Supervisor', 'Engineer', 'Technician', 'Manager', 'Other'];
  const experiences: (ExperienceRange | 'All')[] = ['All', '0-2', '2-5', '5+'];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Search Jobs
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="CNC, Quality, Engineer..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-sm"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Job Role
          </label>
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => (
              <button 
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  role === r 
                    ? 'bg-orange-600 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Experience (Yrs)
          </label>
          <div className="flex flex-wrap gap-2">
            {experiences.map((e) => (
              <button 
                key={e}
                onClick={() => setExperience(e)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  experience === e 
                    ? 'bg-orange-600 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {e === 'All' ? 'All' : `${e} Yrs`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
