import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Banknote, CalendarDays, TrendingUp, CheckCircle } from 'lucide-react';
import './BecomeATasker.css';

export default function BecomeATasker() {
  return (
    <div className="tasker-landing">
      {/* Hero Section */}
      <section className="tasker-hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Earn Money your Way. Be your own Boss.</h1>
            <p>Join TaskGH to find flexible work, set your own rates, and connect with customers right in your neighborhood.</p>
            <Link to="/signup?type=tasker" className="btn btn-primary btn-lg cta-btn">
              Get Started
            </Link>
          </div>
          <div className="hero-image-wrapper">
             <div className="hero-graphics-card">
               <div className="earnings-badge">
                 <span>Weekly Earnings</span>
                 <strong>GHS 1,450</strong>
                 <TrendingUp size={16} color="var(--primary)"/>
               </div>
               <img src="/tasker-bg.svg" alt="" className="abstract-bg"/>
             </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="value-props">
        <div className="container">
          <h2 className="section-title">Why work on TaskGH?</h2>
          
          <div className="props-grid">
            <div className="prop-card">
              <div className="icon-wrapper bg-green">
                 <ShieldCheck size={28} />
              </div>
              <h3>Guaranteed Payments</h3>
              <p>No more fighting over cash. With our <strong>MoMo Escrow system</strong>, the customer deposits your payment before you even start working. You get paid 100% of the time.</p>
            </div>
            
            <div className="prop-card">
              <div className="icon-wrapper bg-orange">
                 <Banknote size={28} />
              </div>
              <h3>You set the Rates</h3>
              <p>You decide how much your time is worth. You can submit custom quotes for fixed jobs, or charge an assessment fee just to show up and diagnose the issue.</p>
            </div>
            
            <div className="prop-card">
              <div className="icon-wrapper bg-blue">
                 <CalendarDays size={28} />
              </div>
              <h3>Flexible Schedule</h3>
              <p>Work when you want, where you want. Turn on your availability when you need cash, and turn it off when you need a break.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <div className="timeline-layout">
            <div className="timeline-step">
               <div className="step-number">1</div>
               <div className="step-content">
                 <h4>Sign up & Verify</h4>
                 <p>Register online and verify your identity using your Ghana Card. We carefully vet all Taskers to build trust in the community.</p>
               </div>
            </div>
            <div className="timeline-step">
               <div className="step-number">2</div>
               <div className="step-content">
                 <h4>Build Your Profile</h4>
                 <p>Select your skills (Plumbing, Moving, Cleaning, etc.), upload photos of your past work, and set your work radius.</p>
               </div>
            </div>
            <div className="timeline-step">
               <div className="step-number">3</div>
               <div className="step-content">
                 <h4>Get Job Alerts</h4>
                 <p>Receive notifications for jobs near you. Review the details and submit your quote instantly from your phone.</p>
               </div>
            </div>
            <div className="timeline-step">
               <div className="step-number">4</div>
               <div className="step-content">
                 <h4>Complete & Get Paid</h4>
                 <p>Once you finish the job, the escrow is released and deposited directly into your Mobile Money wallet.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready CTA */}
      <section className="bottom-cta">
        <div className="container">
          <h2>Ready to grow your business?</h2>
          <p>Join hundreds of Ghanaian professionals earning more on their own terms.</p>
          <Link to="/signup?type=tasker" className="btn btn-primary btn-lg">
            Sign up to be a Tasker
          </Link>
        </div>
      </section>
    </div>
  );
}
