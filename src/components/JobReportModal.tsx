import React from 'react';
import { JobListing, JobApplication, ApplicationStatus } from '../types';
import { X, TrendingUp, Users, CheckCircle2, XCircle, Clock, Download, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

interface JobReportModalProps {
  job: JobListing;
  applications: JobApplication[];
  onClose: () => void;
}

export const JobReportModal: React.FC<JobReportModalProps> = ({ job, applications, onClose }) => {
  const totalApps = applications.length;
  const hiredCount = applications.filter(a => a.status === 'Hired').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;
  const activeCount = applications.filter(a => a.status !== 'Hired' && a.status !== 'Rejected').length;

  const stages: ApplicationStatus[] = [
    'Sourced', 'Applied', 'Phone Screen', 'Hiring Manager Interview', 'Offer', 'Hired'
  ];

  const stageData = stages.map(stage => ({
    stage,
    count: applications.filter(a => a.status === stage).length
  }));

  const sources = ['Careers Page', 'External Portals'];
  const sourceData = sources.map(source => ({
    source,
    count: applications.filter(a => {
      if (source === 'External Portals') return a.status === 'Sourced';
      return a.status !== 'Sourced';
    }).length
  }));

  const handleDownload = () => {
    const csvContent = [
      ['Job Title', job.title],
      ['Job Code', job.jobCode],
      ['Total Applications', totalApps],
      ['Hired', hiredCount],
      ['Rejected', rejectedCount],
      ['Active', activeCount],
      [''],
      ['Stage', 'Count'],
      ...stageData.map(d => [d.stage, d.count]),
      [''],
      ['Applicant Name', 'Email', 'Status', 'Applied At'],
      ...applications.map(a => [a.applicantName, a.applicantEmail, a.status, format(a.appliedAt, 'yyyy-MM-dd HH:mm')])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `report_${job.jobCode}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded uppercase tracking-wider">
                {job.jobCode}
              </span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recruitment Report</h2>
            </div>
            <p className="text-sm text-gray-500 font-medium">{job.title} • {job.department}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
            >
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* High Level Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Applicants', value: totalApps, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Active Pipeline', value: activeCount, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Hired', value: hiredCount, icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
              { label: 'Rejected', value: rejectedCount, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-2xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Pipeline Breakdown */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900">Pipeline Conversion</h3>
              </div>
              <div className="space-y-4">
                {stageData.map((data, i) => {
                  const percentage = totalApps > 0 ? (data.count / totalApps) * 100 : 0;
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-gray-600">{data.stage}</span>
                        <span className="text-gray-900">{data.count} <span className="text-gray-300 font-medium ml-1">({Math.round(percentage)}%)</span></span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Source Breakdown */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900">Source Performance</h3>
              </div>
              <div className="space-y-6">
                {sourceData.map((data, i) => {
                  const percentage = totalApps > 0 ? (data.count / totalApps) * 100 : 0;
                  return (
                    <div key={i} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-gray-900 mb-1">{data.source}</div>
                        <div className="text-xs text-gray-400 font-medium">{data.count} applications received</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-gray-900">{Math.round(percentage)}%</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contribution</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.slice(0, 5).map(app => (
                    <tr key={app.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{app.applicantName}</div>
                        <div className="text-xs text-gray-400">{app.applicantEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                        {format(app.appliedAt, 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
