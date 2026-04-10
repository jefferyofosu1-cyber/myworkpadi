import React, { useState } from 'react';
import { X, Smartphone, Loader2, CheckCircle2 } from 'lucide-react';
import './MoMoPaymentModal.css';

export default function MoMoPaymentModal({ amount, onClose, onSuccess }) {
  const [provider, setProvider] = useState('MTN');
  const [phone, setPhone] = useState('');
  const [paymentState, setPaymentState] = useState('INPUT'); // INPUT | PROMPT | SUCCESS
  
  const handlePay = (e) => {
    e.preventDefault();
    if (phone.length < 9) return;
    
    setPaymentState('PROMPT');
    
    // Simulate user approving the prompt on their phone
    setTimeout(() => {
      setPaymentState('SUCCESS');
      
      // Auto close and succeed after showing success tick
      setTimeout(() => {
        onSuccess(phone);
      }, 2000);
    }, 4000);
  };

  return (
    <div className="momo-modal-overlay">
      <div className="momo-modal-card">
        <button onClick={onClose} className="momo-close-btn" disabled={paymentState === 'PROMPT'}>
          <X size={20} />
        </button>

        {paymentState === 'INPUT' && (
          <div className="momo-modal-body">
            <div className="momo-header">
              <h3>Secure Escrow Deposit</h3>
              <p>Pay with Mobile Money</p>
            </div>

            <div className="momo-amount">
              GHS {parseFloat(amount).toFixed(2)}
            </div>

            <form onSubmit={handlePay}>
              <div className="momo-form-group">
                <label>Select Provider</label>
                <div className="provider-grid">
                  <button 
                    type="button"
                    className={`provider-btn ${provider === 'MTN' ? 'active' : ''}`}
                    onClick={() => setProvider('MTN')}
                  >
                    MTN
                  </button>
                  <button 
                    type="button"
                    className={`provider-btn ${provider === 'VODAFONE' ? 'active' : ''}`}
                    onClick={() => setProvider('VODAFONE')}
                  >
                    Telecel
                  </button>
                  <button 
                    type="button"
                    className={`provider-btn ${provider === 'AIRTELTIGO' ? 'active' : ''}`}
                    onClick={() => setProvider('AIRTELTIGO')}
                  >
                    AT
                  </button>
                </div>
              </div>

              <div className="momo-form-group">
                <label>Mobile Money Number</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 0244123456" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  required
                />
              </div>

              <button type="submit" className="momo-pay-btn" disabled={phone.length < 9}>
                Pay GHS {parseFloat(amount).toFixed(2)}
              </button>
            </form>
            
            <div className="momo-footer">
              <span className="secure-badge">
                <Smartphone size={14} /> Powering secure payments through Paystack
              </span>
            </div>
          </div>
        )}

        {paymentState === 'PROMPT' && (
          <div className="momo-modal-body text-center">
            <Loader2 size={48} className="momo-spinner text-primary" />
            <h3 className="momo-status-title">Authorise Payment</h3>
            <p className="momo-status-desc">
              Check your phone ({phone}). Enter your MoMo PIN to authorise the transaction of <strong>GHS {parseFloat(amount).toFixed(2)}</strong>.
            </p>
          </div>
        )}

        {paymentState === 'SUCCESS' && (
          <div className="momo-modal-body text-center">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={64} className="text-green" />
            </div>
            <h3 className="momo-status-title">Payment Successful</h3>
            <p className="momo-status-desc text-green">
              Your deposit is securely held in escrow.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
