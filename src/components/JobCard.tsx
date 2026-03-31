import React from 'react';
import { JobListing } from '../types';
import { Briefcase, MapPin, IndianRupee, Clock, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: JobListing;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>
        <span className="bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {job.jobType}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          {job.location}
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
          {job.experience} Yrs
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <IndianRupee className="w-4 h-4 mr-2 text-gray-400" />
          {job.salary || 'Not Disclosed'}
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          {formatDistanceToNow(job.postedAt)} ago
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {job.skills.slice(0, 3).map((skill, idx) => (
          <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="text-[10px] text-gray-400">+{job.skills.length - 3} more</span>
        )}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
        <Link 
          to={`/job/${job.id}`}
          className="flex-1 text-center py-2.5 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          View Details
        </Link>
        <Link 
          to={`/apply/${job.id}`}
          className="flex-1 text-center py-2.5 rounded-lg bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors shadow-sm"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};
