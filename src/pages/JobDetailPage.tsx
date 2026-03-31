import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { JobListing } from '../types';
import { jobService } from '../services/jobService';
import { 
  ArrowLeft, MapPin, Briefcase, IndianRupee, Clock, 
  Send, Phone, Mail, ExternalLink, Loader2, User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      jobService.getJobById(id).then(data => {
        setJob(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
        <Link to="/" className="text-orange-600 font-semibold flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-600 font-medium">{job.company}</p>
                </div>
                <span className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                  {job.jobType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-50">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</p>
                  <div className="flex items-center text-gray-900 font-medium">
                    <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                    {job.location}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Experience</p>
                  <div className="flex items-center text-gray-900 font-medium">
                    <Briefcase className="w-4 h-4 mr-2 text-orange-600" />
                    {job.experience} Yrs
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Salary</p>
                  <div className="flex items-center text-gray-900 font-medium">
                    <IndianRupee className="w-4 h-4 mr-2 text-orange-600" />
                    {job.salary || 'Not Disclosed'}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Posted</p>
                  <div className="flex items-center text-gray-900 font-medium">
                    <Clock className="w-4 h-4 mr-2 text-orange-600" />
                    {formatDistanceToNow(job.postedAt)} ago
                  </div>
                </div>
              </div>

              <div className="py-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
                <div className="prose prose-orange max-w-none text-gray-600 leading-relaxed">
                  <ReactMarkdown>{job.description}</ReactMarkdown>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Apply Section */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Interested?</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Fill out our detailed application form to schedule your interview with <span className="font-bold text-gray-900">{job.company}</span>.
              </p>
              
              <Link 
                to={`/apply/${job.id}`}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all flex items-center justify-center group"
              >
                <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Apply Now
              </Link>

              <div className="mt-8 pt-6 border-t border-gray-50 space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company Contact</p>
                {job.hrName && (
                  <div className="flex items-center text-sm text-gray-900 font-semibold">
                    <User className="w-4 h-4 mr-3 text-orange-600" />
                    {job.hrName} (HR)
                  </div>
                )}
                {job.contactPhone && (
                  <a href={`tel:${job.contactPhone}`} className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    {job.contactPhone}
                  </a>
                )}
                {job.contactEmail && (
                  <a href={`mailto:${job.contactEmail}`} className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    {job.contactEmail}
                  </a>
                )}
                {job.applyLink && (
                  <a 
                    href={job.applyLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-orange-600 font-semibold hover:underline"
                  >
                    <ExternalLink className="w-4 h-4 mr-3" />
                    Apply on Company Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
