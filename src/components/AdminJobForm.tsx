import React, { useState } from 'react';
import { JobListing, JobRole, ExperienceRange, JobType, WorkType, JobStatus } from '../types';
import { jobService } from '../services/jobService';
import { Loader2, Save } from 'lucide-react';

interface AdminJobFormProps {
  initialData?: JobListing;
  onSuccess: () => void;
}

export const AdminJobForm: React.FC<AdminJobFormProps> = ({ initialData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<JobListing, 'id' | 'postedAt' | 'lastActivityAt'>>({
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || 'Delhi NCR',
    salary: initialData?.salary || '',
    experience: initialData?.experience || '0-2',
    jobType: initialData?.jobType || 'Full-time',
    workType: initialData?.workType || 'On-site',
    role: initialData?.role || 'Sales',
    department: initialData?.department || 'Support',
    openings: initialData?.openings || 1,
    status: initialData?.status || 'Published',
    description: initialData?.description || '',
    skills: initialData?.skills || [],
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || '',
    hrName: initialData?.hrName || '',
    applyLink: initialData?.applyLink || ''
  });

  const [skillInput, setSkillInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await jobService.updateJob(initialData.id, {
          ...formData,
          lastActivityAt: Date.now()
        });
      } else {
        await jobService.addJob({
          ...formData,
          postedAt: Date.now(),
          lastActivityAt: Date.now()
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save job listing.');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const roleOptions: JobRole[] = ['Sales', 'HR', 'Admin', 'Marketing', 'Finance', 'Logistics', 'Operations', 'Manager', 'Other'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Title</label>
          <input 
            required
            type="text" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            placeholder="e.g. Customer Support Representative"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company Name</label>
          <input 
            required
            type="text" 
            value={formData.company}
            onChange={e => setFormData({...formData, company: e.target.value})}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            placeholder="e.g. Workable Customer Enablement"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Department</label>
          <input 
            required
            type="text" 
            value={formData.department}
            onChange={e => setFormData({...formData, department: e.target.value})}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            placeholder="e.g. Support"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Number of Openings</label>
          <input 
            required
            type="number" 
            min="1"
            value={formData.openings}
            onChange={e => setFormData({...formData, openings: parseInt(e.target.value) || 1})}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</label>
          <input 
            required
            type="text" 
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            placeholder="e.g. Berlin, Germany"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Salary Range</label>
          <input 
            type="text" 
            value={formData.salary}
            onChange={e => setFormData({...formData, salary: e.target.value})}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            placeholder="e.g. ₹25,000 - ₹35,000"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Experience</label>
          <select 
            value={formData.experience}
            onChange={e => setFormData({...formData, experience: e.target.value as ExperienceRange})}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
          >
            <option value="0-2">0-2 Years</option>
            <option value="2-5">2-5 Years</option>
            <option value="5+">5+ Years</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Type</label>
          <select 
            value={formData.jobType}
            onChange={e => setFormData({...formData, jobType: e.target.value as JobType})}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
          >
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Work Type</label>
          <select 
            value={formData.workType}
            onChange={e => setFormData({...formData, workType: e.target.value as WorkType})}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
          >
            <option value="On-site">On-site</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Status</label>
          <select 
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value as JobStatus})}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
          >
            <option value="Published">Published</option>
            <option value="Internal">Used Internally</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role Category</label>
          <select 
            value={formData.role}
            onChange={e => setFormData({...formData, role: e.target.value as JobRole})}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
          >
            {roleOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Description (Markdown supported)</label>
        <textarea 
          required
          rows={6}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-mono"
          placeholder="Describe the job responsibilities, requirements, etc."
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Key Skills</label>
        <div className="flex space-x-2 mb-2">
          <input 
            type="text" 
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            placeholder="Add a skill (e.g. Customer Support, Zendesk, Intercom)"
          />
          <button 
            type="button"
            onClick={addSkill}
            className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map(skill => (
            <span key={skill} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="ml-2 hover:text-orange-900">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-50 pt-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">HR Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">HR Name</label>
            <input 
              type="text" 
              value={formData.hrName}
              onChange={e => setFormData({...formData, hrName: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              placeholder="e.g. Mr. Neeraj Kumar"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Phone</label>
            <input 
              type="tel" 
              value={formData.contactPhone}
              onChange={e => setFormData({...formData, contactPhone: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              placeholder="e.g. 9876543210"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Email</label>
            <input 
              type="email" 
              value={formData.contactEmail}
              onChange={e => setFormData({...formData, contactEmail: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              placeholder="e.g. hr@company.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Apply Link (External)</label>
            <input 
              type="url" 
              value={formData.applyLink}
              onChange={e => setFormData({...formData, applyLink: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <button 
        disabled={loading}
        type="submit"
        className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all flex items-center justify-center disabled:opacity-70"
      >
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" />
            {initialData ? 'Update Job Listing' : 'Publish Job Listing'}
          </>
        )}
      </button>
    </form>
  );
};
