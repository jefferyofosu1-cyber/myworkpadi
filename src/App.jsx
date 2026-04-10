import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Core Pages
import LandingPage from './pages/LandingPage'
import ServicesPage from './pages/ServicesPage'
import HowItWorksPage from './pages/HowItWorksPage'
import BecomeATaskerPage from './pages/BecomeATaskerPage'
import AboutPage from './pages/AboutPage'
import SupportPage from './pages/SupportPage'

// Functional Flows
import BookingFlow from './pages/BookingFlow'
import AuthFlow from './pages/AuthFlow'
import PublicTaskerProfile from './pages/PublicTaskerProfile'

// Tasker Dashboard
import TaskerLayout from './components/layout/TaskerLayout'
import DashboardOverview from './pages/tasker/DashboardOverview'
import JobBoard from './pages/tasker/JobBoard'
import ActiveJobs from './pages/tasker/ActiveJobs'

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ minHeight: '80vh' }}>{children}</main>
    <Footer />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Public Customer Routes */}
          <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
          <Route path="/services" element={<MainLayout><ServicesPage /></MainLayout>} />
          <Route path="/how-it-works" element={<MainLayout><HowItWorksPage /></MainLayout>} />
          <Route path="/become-a-tasker" element={<MainLayout><BecomeATaskerPage /></MainLayout>} />
          <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
          <Route path="/support" element={<MainLayout><SupportPage /></MainLayout>} />
          
          <Route path="/booking" element={<MainLayout><BookingFlow /></MainLayout>} />
          <Route path="/profile/:id" element={<MainLayout><PublicTaskerProfile /></MainLayout>} />
          
          <Route path="/signup" element={<MainLayout><AuthFlow /></MainLayout>} />
          <Route path="/login" element={<MainLayout><AuthFlow /></MainLayout>} />
          
          {/* Tasker Dashboard Routes */}
          <Route path="/tasker" element={<TaskerLayout />}>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="jobs" element={<JobBoard />} />
            <Route path="active" element={<ActiveJobs />} />
            <Route path="wallet" element={<div className="container" style={{padding: 40}}><h1>Wallet (Coming Soon)</h1></div>} />
          </Route>

          <Route path="*" element={<MainLayout><div className="container" style={{padding: '120px 0', textAlign: 'center'}}><h2>404 - Page Not Found</h2></div></MainLayout>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
