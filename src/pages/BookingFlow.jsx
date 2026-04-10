import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Calendar, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import MoMoPaymentModal from '../components/payment/MoMoPaymentModal';
import { api } from '../utils/api';
import './BookingFlow.css';

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState('fixed');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const handleBookingStart = async () => {
    const userId = localStorage.getItem('taskgh_user_id');
    if (!userId) {
      alert("Please login first to confirm your booking.");
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    try {
      // POST booking structure
      const payload = {
         customer_id: userId,
         // We pass a dummy category ID. In full production, this maps to the UI selection.
         category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
         b_type: bookingType,
         location_address: 'Accra, Ghana',
         location_lat: 5.6037,
         location_lng: -0.1870,
         problem_description: 'Need assistance as requested in UI',
      };
      
      const res = await api.post('/bookings', payload);
      setBookingId(res.data.id);
      
      if (amountDue === 0) {
         alert('Booking confirmed immediately!');
         navigate('/');
      } else {
         setShowPaymentModal(true);
      }
    } catch (err) {
      alert(`Backend Booking failed: ${err.message}. (Did you seed your Supabase database with a category?)`);
      console.warn("Continuing to mock payment for demonstration...");
      setShowPaymentModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (phone) => {
    setShowPaymentModal(false);
    try {
      // Intiate the actual Paystack logic
      if (bookingId) {
        await api.post('/payments/initiate', {
           bookingId: bookingId,
           amount_ghs: amountDue,
           phone: phone,
           provider: 'mtn', // Defaulted or captured from modal
           payment_type: bookingType === 'assessment' ? 'assessment' : 'deposit'
        });
        alert(`MoMo prompt sent to ${phone}! Awaiting your PIN approval securely via Paystack.`);
      } else {
        alert(`Demo: Sent prompt to ${phone}.`);
      }
    } catch (err) {
      alert(`Payment Gateway Error: ${err.message}`);
    }
    navigate('/');
  };

  const amountDue = bookingType === 'fixed' ? 0.00 : 25.00;

  return (
    <div className="booking-page">
      <div className="container">
        
        <div className="booking-layout">
          {/* Main Form Area */}
          <div className="booking-main">
            <h1 className="booking-title">Book a Handyman</h1>
            
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${(step/3)*100}%`}}></div>
            </div>

            {step === 1 && (
              <div className="wizard-step">
                <h2>1. Task Details</h2>
                
                <div className="form-group">
                  <label>What do you need help with?</label>
                  <textarea placeholder="Please describe the problem or task in detail..." rows={4}></textarea>
                </div>

                <div className="form-group">
                  <label>Task Location</label>
                  <div className="input-with-icon">
                    <MapPin size={20} className="input-icon" />
                    <input type="text" placeholder="Enter your full address" />
                  </div>
                </div>

                <button className="btn btn-primary" onClick={() => setStep(2)}>
                  Continue to Booking Type <ArrowRight size={18} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="wizard-step fade-in">
                <h2>2. Choose Booking Type</h2>
                
                <div className="type-radios">
                  <div 
                    className={`type-card ${bookingType === 'fixed' ? 'active' : ''}`}
                    onClick={() => setBookingType('fixed')}
                  >
                    <div className="card-header">
                      <h3>Fixed Schedule</h3>
                      <div className="radio-circle">
                         {bookingType === 'fixed' && <div className="radio-dot"></div>}
                      </div>
                    </div>
                    <p>I know exactly what needs to be done. Tasker comes ready to work.</p>
                  </div>

                  <div 
                    className={`type-card ${bookingType === 'assessment' ? 'active' : ''}`}
                    onClick={() => setBookingType('assessment')}
                  >
                     <div className="card-header">
                      <h3>Assessment Visit</h3>
                      <div className="radio-circle">
                        {bookingType === 'assessment' && <div className="radio-dot"></div>}
                      </div>
                    </div>
                    <p>I need the Tasker to inspect the issue first and provide a detailed quote.</p>
                    <div className="assessment-fee-badge">GHS 25 Assessment Fee required to hold slot</div>
                  </div>
                </div>

                <div className="form-group" style={{marginTop: 32}}>
                  <label>When do you need it done?</label>
                  <div className="date-time-grid">
                    <div className="input-with-icon">
                      <Calendar size={20} className="input-icon" />
                      <input type="date" />
                    </div>
                    <div className="input-with-icon">
                      <Clock size={20} className="input-icon" />
                      <input type="time" />
                    </div>
                  </div>
                </div>

                <div className="step-actions">
                  <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(3)}>
                    Continue to Payment <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="wizard-step fade-in">
                <h2>3. Secure Your Booking</h2>
                
                <div className="payment-summary">
                  <div className="summary-row">
                    <span>Task Category</span>
                    <strong>Handyman</strong>
                  </div>
                  <div className="summary-row">
                    <span>Booking Type</span>
                    <strong>{bookingType === 'fixed' ? 'Fixed Work' : 'Assessment Visit'}</strong>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Amount Due Now</span>
                    <strong>GHS {amountDue.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="trust-box">
                  <ShieldCheck size={24} color="var(--primary)" />
                  <p><strong>MoMo Escrow Protection</strong><br/>
                  Your funds are held securely until you approve the quote or the job is completed.</p>
                </div>

                <div className="step-actions mt-xl">
                   <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                   <button 
                     className="btn btn-primary btn-block"
                     onClick={handleBookingStart}
                     disabled={isSubmitting}
                   >
                     {isSubmitting ? 'Processing...' : (amountDue === 0 ? 'Confirm Booking (No Deposit)' : 'Pay with MoMo')}
                   </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="booking-sidebar">
             <div className="sidebar-card">
               <h3>How pricing works</h3>
               <ul className="sidebar-list">
                 <li>
                   <CheckCircle2 color="var(--primary)" size={20} />
                   <span>No hidden fees. You only pay for the agreed quote.</span>
                 </li>
                 <li>
                   <CheckCircle2 color="var(--primary)" size={20} />
                   <span>Funds are held safely in escrow until you approve.</span>
                 </li>
                 <li>
                   <CheckCircle2 color="var(--primary)" size={20} />
                   <span>Cancel anytime before tasker arrives for a full refund (minus assessment fee).</span>
                 </li>
               </ul>
             </div>
          </div>

        </div>

      </div>

      {showPaymentModal && amountDue > 0 && (
        <MoMoPaymentModal 
          amount={amountDue}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      
      {showPaymentModal && amountDue === 0 && (
        handlePaymentSuccess('No Deposit Required')
      )}
    </div>
  );
}
