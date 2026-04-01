import React from 'react';
import { JobApplication, ApplicationStatus } from '../types';

interface RejectionModalProps {
  application: JobApplication;
  onClose: () => void;
  onConfirm: (reason: string, stage: ApplicationStatus) => void;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({ application, onClose, onConfirm }) => {
  const pipelineStages: ApplicationStatus[] = [
    'Sourced', 'Applied', 'Phone Screen', 'Hiring Manager Interview', 'Offer', 'Hired'
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Candidate</h3>
        <p className="text-gray-500 text-sm mb-6">Please select the stage at which <span className="font-bold text-gray-900">{application.applicantName}</span> was rejected.</p>
        
        <div className="space-y-2 mb-8">
          {pipelineStages.map(stage => (
            <button
              key={stage}
              onClick={() => onConfirm('Rejected', stage)}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-orange-500 hover:bg-orange-50 transition-all text-sm font-semibold text-gray-700"
            >
              {stage}
            </button>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
