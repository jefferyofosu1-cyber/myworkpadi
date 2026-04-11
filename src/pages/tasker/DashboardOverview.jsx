import { TrendingUp, Clock, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';
import './TaskerPages.css';

export default function DashboardOverview() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('taskgh_user_id');
        const [statsRes, profileRes] = await Promise.all([
          api.get(`/bookings/stats/${userId}`),
          api.get(`/profiles/me`)
        ]);
        setData({
          stats: statsRes.data,
          profile: profileRes.data
        });
      } catch (err) {
        console.error('Dashboard Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex-center" style={{height: '400px'}}>
      <Loader2 className="animate-spin" size={32} />
    </div>
  );

  const stats = data?.stats || { totalEarned: 0, pendingEscrow: 0, completedCount: 0 };
  const profile = data?.profile || { full_name: 'Tasker' };

  return (
    <div className="dashboard-overview">
      <h1 className="page-title">Welcome back, {profile.full_name.split(' ')[0]}</h1>
      <p className="page-subtitle">Here is what is happening with your tasks today.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrap" style={{background: 'var(--primary-light)', color: 'var(--primary)'}}>
              <TrendingUp size={24} />
            </div>
          </div>
          <h3>Total Earned</h3>
          <div className="stat-value">GHS {stats.totalEarned.toFixed(2)}</div>
          <div className="stat-trend positive">Total lifetime earnings</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrap" style={{background: 'var(--accent-light)', color: 'var(--accent)'}}>
              <Clock size={24} />
            </div>
          </div>
          <h3>Pending Escrow</h3>
          <div className="stat-value">GHS {stats.pendingEscrow.toFixed(2)}</div>
          <div className="stat-trend neutral">Awaiting job completions</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrap" style={{background: 'rgba(52, 152, 219, 0.15)', color: '#3498db'}}>
              <CheckCircle2 size={24} />
            </div>
          </div>
          <h3>Jobs Completed</h3>
          <div className="stat-value">{stats.completedCount}</div>
          <div className="stat-trend positive">Total successful tasks</div>
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
