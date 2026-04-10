import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import './QuoteSubmitModal.css';

export default function QuoteSubmitModal({ job, onClose }) {
  const [labor, setLabor] = useState('');
  const [materials, setMaterials] = useState('');
  
  const laborNum = parseFloat(labor) || 0;
  const materialsNum = parseFloat(materials) || 0;
  
  // Commission logic according to specs
  const commission = laborNum * 0.12; 
  const total = laborNum + materialsNum;

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in-up">
        <div className="modal-header">
          <h2>Submit Quote</h2>
          <button className="icon-btn" onClick={onClose}><X size={20}/></button>
        </div>

        <div className="modal-body">
          <div className="job-summary-box">
             <strong>{job.title}</strong>
             <p>{job.desc}</p>
          </div>

          <div className="form-group">
            <label>Labor Cost (GHS)</label>
            <input 
              type="number" 
              placeholder="e.g. 150" 
              value={labor} 
              onChange={e => setLabor(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label>Materials Cost (GHS) - Optional</label>
            <input 
              type="number" 
              placeholder="e.g. 50" 
              value={materials} 
              onChange={e => setMaterials(e.target.value)} 
            />
          </div>

          <div className="quote-breakdown">
            <div className="breakdown-row">
               <span>Labor</span>
               <span>GHS {laborNum.toFixed(2)}</span>
            </div>
            <div className="breakdown-row">
               <span>Materials</span>
               <span>GHS {materialsNum.toFixed(2)}</span>
            </div>
            <div className="breakdown-row commission">
               <span>TaskGH Fee (12% of Labor) <br/><small>Deducted automatically</small></span>
               <span className="text-red">-GHS {commission.toFixed(2)}</span>
            </div>
            <div className="breakdown-total">
               <span>Total Quote to Customer</span>
               <span>GHS {total.toFixed(2)}</span>
            </div>
            <div className="trust-box modal-trust">
              <Info size={16}/>
              <p>Customer will see GHS {total.toFixed(2)}. Once approved, GHS {(total/2).toFixed(2)} will be held in Escrow before you begin.</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            alert('Quote Submitted to Escrow! Returning to dashboard.');
            onClose();
          }}>Send Quote to Customer</button>
        </div>
      </div>
    </div>
  );
}
