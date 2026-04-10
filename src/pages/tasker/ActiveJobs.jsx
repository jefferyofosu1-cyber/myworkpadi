import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';
import './TaskerPages.css';

export default function ActiveJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/bookings/my');
        setJobs(res.data);
      } catch (err) {
        setError('Failed to load your tasks. Please refresh.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const getStatusLabel = (status) => {
    const labels = {
      'assigned': 'Assigned',
      'in_progress': 'In Progress',
      'quoted': 'Waiting for Approval',
      'deposit_paid': 'Deposit Received',
      'completed': 'Completed',
    };
    return labels[status] || status.toUpperCase();
  };

  if (loading) return (
    <div className="flex-center" style={{height: '400px', flexDirection: 'column', gap: '12px'}}>
      <Loader2 className="animate-spin" size={32} />
      <p>Loading your active tasks...</p>
    </div>
  );

  return (
    <div className="active-jobs page-enter">
      <h1 className="page-title">Active Tasks</h1>
      <p className="page-subtitle">Track your ongoing jobs and escrow status.</p>

      {error && <div className="error-banner">{error}</div>}

      <div className="job-list">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any active tasks yet. Check the Job Board to find work!</p>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="job-card" style={{flexDirection: 'column'}}>
              
              <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 16}}>
                 <div>
                   <h3 style={{marginBottom: 4}}>{job.categories?.name}</h3>
                   <span style={{color: 'var(--muted)', fontSize: 13}}>Client: {job.customer?.full_name || 'Guest User'}</span>
                 </div>
                 <div style={{textAlign: 'right'}}>
                   <div className="job-price" style={{fontSize: 18}}>
                     {job.status === 'assigned' ? 'New Job' : `GHS ${job.total_amount_ghs || 0}`}
                   </div>
                   <span className="badge badge-green">{getStatusLabel(job.status)}</span>
                 </div>
              </div>

              {/* Status Pipeline Visualizer */}
              <div className="status-pipeline">
                <div className={`pipeline-step ${['quoted', 'deposit_paid', 'in_progress', 'completed'].includes(job.status) ? 'active' : ''}`}>
                  <div className="step-icon"><Clock size={16} /></div>
                  <span>Quoted</span>
                </div>
                <div className="pipeline-line"></div>
                <div className={`pipeline-step ${['deposit_paid', 'in_progress', 'completed'].includes(job.status) ? 'active' : ''}`}>
                   <div className="step-icon"><CheckCircle2 size={16} /></div>
                   <span>Escrowed</span>
                </div>
                <div className="pipeline-line"></div>
                <div className={`pipeline-step ${job.status === 'completed' ? 'active' : ''}`}>
                   <div className="step-icon"><CheckCircle2 size={16} /></div>
                   <span>Finished</span>
                </div>
              </div>

              <div style={{marginTop: 24, display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '12px'}}>
                 {job.status === 'assigned' && (
                   <button className="btn btn-primary" onClick={() => alert('Opening quote modal...')}>Submit Quote</button>
                 )}
                 {job.status === 'deposit_paid' && (
                   <button className="btn btn-primary" onClick={() => alert('Marking as complete...')}>Complete Job</button>
                 )}
                 <button className="btn btn-secondary">View Details</button>
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}
