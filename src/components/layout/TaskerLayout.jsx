import React from 'react';
import { Outlet } from 'react-router-dom';
import TaskerSidebar from './TaskerSidebar';
import { Bell, User } from 'lucide-react';
import './TaskerLayout.css';

export default function TaskerLayout() {
  return (
    <div className="tasker-layout">
      <TaskerSidebar />
      <div className="tasker-main">
        <header className="tasker-header">
          <div className="header-search">
            {/* Can add global tasker search here later */}
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={20} />
              <div className="notification-dot"></div>
            </button>
            <div className="user-profile-btn">
              <div className="user-avatar">
                <User size={20} className="avatar-icon"/>
              </div>
              <span>Kwame M.</span>
            </div>
          </div>
        </header>

        <main className="tasker-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
