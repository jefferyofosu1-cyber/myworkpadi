import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Loader2 } from 'lucide-react';
import QuoteSubmitModal from '../../components/tasker/QuoteSubmitModal';
import { api } from '../../utils/api';
import './TaskerPages.css';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/available');
      setJobs(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch available jobs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (jobId) => {
    try {
      await api.post(`/bookings/${jobId}/accept`);
      alert('Job Accepted! It is now in your Active Jobs list.');
      // Refresh the list
      fetchJobs();
    } catch (err) {
      alert(err.message || 'Failed to accept job.');
    }
  };

  if (loading) return (
    <div className="flex-center" style={{height: '400px', flexDirection: 'column', gap: '12px'}}>
      <Loader2 className="animate-spin" size={32} />
      <p>Finding jobs in your area...</p>
    </div>
  );

  return (
    <div className="job-board page-enter">
      <div className="page-header">
        <h1 className="page-title">Available Jobs</h1>
        <p className="page-subtitle">Jobs matching your skills in your active radius.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="job-list">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>No jobs available right now. We'll notify you when someone needs your skills!</p>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-main">
                <div style={{display: 'flex', gap: '12px', alignItems: 'center', marginBottom: 12}}>
                  <span className="badge badge-green">{job.categories?.name || 'General'}</span>
                  {job.assessment_fee_ghs > 0 && (
                    <span className="fee-badge">GHS {job.assessment_fee_ghs} Assessment Fee</span>
                  )}
                </div>
                
                <h3>{job.problem_description?.substring(0, 60)}...</h3>
                
                <div className="job-meta">
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{job.location_address}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{job.scheduled_at ? new Date(job.scheduled_at).toLocaleString() : 'As soon as possible'}</span>
                  </div>
                </div>

                <p className="job-desc">{job.problem_description}</p>
              </div>

              <div className="job-actions">
                <div className="job-price">
                  {job.assessment_fee_ghs > 0 ? `GHS ${job.assessment_fee_ghs}` : 'Quote Required'}
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleAccept(job.id)}
                >
                  Accept Job
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedJob && (
         <QuoteSubmitModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}
