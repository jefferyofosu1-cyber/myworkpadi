import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Star, Clock, MapPin, CheckCircle2, MessageSquare } from 'lucide-react';
import './PublicTaskerProfile.css';

// Mock Data for the Profile
const MOCK_TASKER = {
  id: 't-123',
  name: "Samuel Osei",
  avatar: "https://i.pravatar.cc/300?img=11",
  rating: 4.9,
  reviewsCount: 124,
  tasksCompleted: 156,
  onTimeRate: "98%",
  responseRate: "1 hr",
  location: "East Legon, Accra",
  bio: "Hi, I'm Samuel! I have over 8 years of experience in electrical work, plumbing, and general home maintenance. I pride myself on showing up on time, fixing the problem right the first time, and leaving your space cleaner than I found it. I always bring my own tools.",
  skills: ["Plumbing Maintenance", "Electrical Help", "Generator Servicing", "TV Mounting", "Furniture Assembly"],
  verified: true,
  reviews: [
    { id: 1, author: "Ama D.", rating: 5, date: "2 weeks ago", text: "Samuel was fantastic. He fixed our leaking pipe in under 30 minutes and was extremely professional." },
    { id: 2, author: "Kwame K.", rating: 5, date: "1 month ago", text: "Very prompt and knows what he's doing. Mounted two 65-inch TVs flawlessly." },
    { id: 3, author: "Grace T.", rating: 4, date: "2 months ago", text: "Good work on the generator servicing. Came a bit late due to traffic but communicated well." }
  ]
};

export default function PublicTaskerProfile() {
  const { id } = useParams();
  
  // In a real app we'd fetch data using the ID. Here we use the mock.
  const tasker = MOCK_TASKER;

  return (
    <div className="profile-page">
      <div className="container profile-layout">
        
        {/* Left Column: Details */}
        <div className="profile-main">
          
          <div className="profile-header-card">
            <img src={tasker.avatar} alt={tasker.name} className="profile-avatar" />
            <div className="profile-header-info">
              <h1>{tasker.name}</h1>
              <div className="profile-meta-row">
                <span className="rating-badge">
                  <Star size={16} fill="var(--gold)" color="var(--gold)" />
                  {tasker.rating} ({tasker.reviewsCount} reviews)
                </span>
                <span className="location-badge">
                  <MapPin size={16} /> {tasker.location}
                </span>
                {tasker.verified && (
                  <span className="verified-badge">
                    <ShieldCheck size={16} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-stats-grid">
            <div className="stat-card">
              <CheckCircle2 color="var(--green)" size={24} />
              <div className="stat-info">
                <strong>{tasker.tasksCompleted}</strong>
                <span>Tasks Completed</span>
              </div>
            </div>
            <div className="stat-card">
              <Clock color="var(--gold)" size={24} />
              <div className="stat-info">
                <strong>{tasker.onTimeRate}</strong>
                <span>On-Time Arrival</span>
              </div>
            </div>
            <div className="stat-card">
              <MessageSquare color="var(--green)" size={24} />
              <div className="stat-info">
                <strong>{tasker.responseRate}</strong>
                <span>Response Time</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>About me</h2>
            <p className="profile-bio">{tasker.bio}</p>
          </div>

          <div className="profile-section">
            <h2>Skills & Expertise</h2>
            <div className="skills-row">
              {tasker.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <h2>Reviews ({tasker.reviewsCount})</h2>
            <div className="reviews-list">
              {tasker.reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <strong>{review.author}</strong>
                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < review.rating ? "var(--gold)" : "transparent"} 
                          color={i < review.rating ? "var(--gold)" : "var(--border)"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                  <span className="review-date">{review.date}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-outline" style={{marginTop: 24, width: '100%'}}>Read all reviews</button>
          </div>

        </div>

        {/* Right Column: Booking Sticky */}
        <div className="profile-sidebar">
          <div className="booking-widget">
            <h3>Ready to hire {tasker.name.split(' ')[0]}?</h3>
            <p>Tell us what you need done, and we'll send your request directly to {tasker.name.split(' ')[0]}.</p>
            
            <Link to={`/booking?taskerId=${tasker.id}`} className="btn btn-primary btn-block widget-btn">
              Book Now
            </Link>
            
            <div className="widget-trust">
               <ShieldCheck size={16} />
               <span>You won't be charged until the job is done.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
