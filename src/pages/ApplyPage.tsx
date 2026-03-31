import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { JobListing, JobApplication, InterviewSlot } from '../types';
import { 
  ArrowLeft, Loader2, CheckCircle2, Calendar, Clock, 
  User, Phone, Mail, Building, MapPin, Briefcase, 
  IndianRupee, Timer, FileText, Upload, X
} from 'lucide-react';
import { format, addDays, startOfToday, isWeekend } from 'date-fns';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const ApplyPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    applicantName: '',
    applicantPhone: '',
    applicantEmail: '',
    currentCompany: '',
    location: '',
    experience: '',
    currentCTC: '',
    expectedCTC: '',
    noticePeriod: ''
  });

  const [slots, setSlots] = useState<InterviewSlot[]>([
    { date: '', time: '' },
    { date: '', time: '' },
    { date: '', time: '' }
  ]);

  useEffect(() => {
    if (jobId) {
      jobService.getJobById(jobId).then(data => {
        setJob(data);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    // Validate slots
    const hasEmptySlots = slots.some(s => !s.date || !s.time);
    if (hasEmptySlots) {
      alert('Please select all 3 interview slots.');
      return;
    }

    // Ensure unique dates
    const uniqueDates = new Set(slots.map(s => s.date));
    if (uniqueDates.size !== 3) {
      alert('Please choose 3 different days for your interview slots.');
      return;
    }

    setSubmitting(true);
    try {
      let resumeUrl = '';
      if (resumeFile) {
        const fileRef = ref(storage, `resumes/${job.id}_${Date.now()}_${resumeFile.name}`);
        const uploadResult = await uploadBytes(fileRef, resumeFile);
        resumeUrl = await getDownloadURL(uploadResult.ref);
      }

      const application: Omit<JobApplication, 'id'> = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        ...formData,
        interviewSlots: slots,
        resumeUrl,
        appliedAt: Date.now()
      };
      await jobService.submitApplication(application);
      setSubmitted(true);
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateSlot = (index: number, field: keyof InterviewSlot, value: string) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSlots(newSlots);
  };

  // Generate next 10 business days
  const getBusinessDays = () => {
    const days = [];
    let current = addDays(startOfToday(), 1);
    while (days.length < 10) {
      if (!isWeekend(current)) {
        days.push(new Date(current));
      }
      current = addDays(current, 1);
    }
    return days;
  };

  const businessDays = getBusinessDays();
  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading application form...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <Link to="/" className="text-orange-600 font-bold hover:underline">Back to Job Listings</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-gray-100 rounded-3xl p-12 shadow-sm">
          <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for applying to <span className="font-bold text-gray-900">{job.company}</span>. 
            Our team will review your profile and get back to you soon.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Job Details
        </button>

        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-gray-900 p-8 text-white">
            <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">Applying for</p>
            <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
            <p className="text-gray-400">{job.company} • {job.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Details */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center">
                <User className="w-4 h-4 mr-2 text-orange-600" />
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.applicantName}
                    onChange={e => setFormData({...formData, applicantName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.applicantPhone}
                    onChange={e => setFormData({...formData, applicantPhone: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email ID</label>
                  <input 
                    required
                    type="email" 
                    value={formData.applicantEmail}
                    onChange={e => setFormData({...formData, applicantEmail: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    placeholder="yourname@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Location</label>
                  <input 
                    required
                    type="text" 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    placeholder="e.g. Sonipat, Delhi"
                  />
                </div>
              </div>
            </section>

            {/* Professional Details */}
            <section className="space-y-6 pt-6 border-t border-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-orange-600" />
                Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Company</label>
                  <input 
                    required
                    type="text" 
                    value={formData.currentCompany}
                    onChange={e => setFormData({...formData, currentCompany: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    placeholder="Company name or 'Fresher'"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Experience</label>
                  <input 
                    required
                    type="text" 
                    value={formData.experience}
                    onChange={e => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    placeholder="e.g. 2 Years"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current CTC (Annual)</label>
                  <input 
                    required
                    type="text" 
                    value={formData.currentCTC}
                    onChange={e => setFormData({...formData, currentCTC: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    placeholder="e.g. 3.5 LPA"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expected CTC (Annual)</label>
                  <input 
                    required
                    type="text" 
                    value={formData.expectedCTC}
                    onChange={e => setFormData({...formData, expectedCTC: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    placeholder="e.g. 4.5 LPA"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notice Period</label>
                  <input 
                    required
                    type="text" 
                    value={formData.noticePeriod}
                    onChange={e => setFormData({...formData, noticePeriod: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    placeholder="e.g. 30 Days, Immediate"
                  />
                </div>
              </div>
            </section>

            {/* Resume Upload */}
            <section className="space-y-6 pt-6 border-t border-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center">
                <FileText className="w-4 h-4 mr-2 text-orange-600" />
                Resume / CV
              </h3>
              <div className="space-y-4">
                {!resumeFile ? (
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={e => setResumeFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center group-hover:border-orange-500 transition-colors bg-gray-50/50">
                      <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                    <div className="flex items-center">
                      <div className="bg-orange-600 p-2 rounded-lg mr-3">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{resumeFile.name}</p>
                        <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Interview Availability */}
            <section className="space-y-6 pt-6 border-t border-gray-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                  Interview Availability
                </h3>
                <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">
                  Choose 3 different slots
                </span>
              </div>
              
              <div className="space-y-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Slot {index + 1} - Day</label>
                      <select 
                        required
                        value={slots[index].date}
                        onChange={e => updateSlot(index, 'date', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                      >
                        <option value="">Select a business day</option>
                        {businessDays.map(day => (
                          <option key={day.toISOString()} value={format(day, 'yyyy-MM-dd')}>
                            {format(day, 'EEEE, MMM do')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Slot {index + 1} - Time</label>
                      <select 
                        required
                        value={slots[index].time}
                        onChange={e => updateSlot(index, 'time', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <button 
              disabled={submitting}
              type="submit"
              className="w-full bg-orange-600 text-white py-5 rounded-2xl font-bold shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all flex items-center justify-center disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
