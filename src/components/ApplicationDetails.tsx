import React from 'react';
import { JobApplication } from '../types';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Building, 
  IndianRupee, 
  Clock, 
  FileText, 
  ExternalLink,
  Calendar
} from 'lucide-react';

interface ApplicationDetailsProps {
  application: JobApplication;
  onClose: () => void;
}

export const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ application, onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
              <p className="text-gray-500 text-sm">Applied for {application.jobTitle}</p>
            </div>
            <button 
              onClick={onClose}
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
                    <span className="font-semibold text-gray-900">{application.applicantName}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    <a href={`tel:${application.applicantPhone}`} className="hover:text-orange-600 underline">
                      {application.applicantPhone}
                    </a>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <a href={`mailto:${application.applicantEmail}`} className="hover:text-orange-600 underline">
                      {application.applicantEmail}
                    </a>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-gray-600">{application.location || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Professional Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Briefcase className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-gray-600">Exp: <span className="font-semibold text-gray-900">{application.experience || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Building className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-gray-600">Company: <span className="font-semibold text-gray-900">{application.currentCompany || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center text-sm">
                    <IndianRupee className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-gray-600">Current CTC: <span className="font-semibold text-gray-900">{application.currentCTC || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center text-sm">
                    <IndianRupee className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-gray-600">Expected CTC: <span className="font-semibold text-gray-900">{application.expectedCTC || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-gray-600">Notice: <span className="font-semibold text-gray-900">{application.noticePeriod || 'N/A'}</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            {application.resumeUrl && (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-orange-600" />
                  Candidate Resume
                </h3>
                <a 
                  href={application.resumeUrl} 
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
                {application.interviewSlots?.map((slot, idx) => (
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
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
