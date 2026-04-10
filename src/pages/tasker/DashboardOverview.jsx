import React from 'react';
import { TrendingUp, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import './TaskerPages.css';

export default function DashboardOverview() {
  return (
    <div className="dashboard-overview">
      <h1 className="page-title">Welcome back, Kwame 👋</h1>
      <p className="page-subtitle">Here is what is happening with your tasks today.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrap" style={{background: 'var(--primary-light)', color: 'var(--primary)'}}>
              <TrendingUp size={24} />
            </div>
          </div>
          <h3>Total Earned</h3>
          <div className="stat-value">GHS 1,250.00</div>
          <div className="stat-trend positive">+15% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrap" style={{background: 'var(--accent-light)', color: 'var(--accent)'}}>
              <Clock size={24} />
            </div>
          </div>
          <h3>Pending Escrow</h3>
          <div className="stat-value">GHS 450.00</div>
          <div className="stat-trend neutral">Awaiting 2 job completions</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrap" style={{background: 'var(--blue)22', color: 'var(--blue)'}}>
              <CheckCircle2 size={24} />
            </div>
          </div>
          <h3>Jobs Completed</h3>
          <div className="stat-value">24</div>
          <div className="stat-trend positive">5.0 ⭐ average rating</div>
        </div>
      </div>

      <div className="activity-section">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <button className="btn-link">View all</button>
        </div>
        
        <div className="activity-feed">
          <div className="activity-item">
            <div className="activity-dot bg-primary"></div>
            <div className="activity-content">
              <p><strong>Payment Released:</strong> GHS 120.00 added to your wallet for "Fix leaky sink".</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-dot bg-accent"></div>
            <div className="activity-content">
              <p><strong>Quote Accepted:</strong> Customer accepted your quote of GHS 80.00 for "Mount TV". Escrow deposit paid.</p>
              <span className="activity-time">5 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-dot bg-muted"></div>
            <div className="activity-content">
              <p><strong>New Job Alert:</strong> Plumber needed in East Legon (3km away).</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
