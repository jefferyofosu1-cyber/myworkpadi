import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, Wallet, Settings, LogOut } from 'lucide-react';
import './TaskerLayout.css';

export default function TaskerSidebar() {
  return (
    <aside className="tasker-sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">✨</span> TASKGH
        <div className="tasker-badge">Pro</div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/tasker/dashboard" end className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </NavLink>
        
        <NavLink to="/tasker/jobs" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Briefcase size={20} />
          <span>Job Board</span>
          <span className="nav-badge">3</span>
        </NavLink>
        
        <NavLink to="/tasker/active" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <CheckSquare size={20} />
          <span>Active Tasks</span>
        </NavLink>

        <NavLink to="/tasker/wallet" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Wallet size={20} />
          <span>Wallet</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="nav-item text-red">
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
