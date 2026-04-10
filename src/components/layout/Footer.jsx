import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { ShieldCheck, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <div className="brand footer-brand">✨ TASKGH</div>
          <p className="footer-desc">
            Your to-do list, done. Connecting you with verified taskers in Ghana.
          </p>
          <div className="trust-badge">
            <ShieldCheck className="trust-icon" />
            <span>Escrow Protected Payments</span>
          </div>
        </div>
        
        <div className="footer-col">
          <h4>Discover</h4>
          <Link to="/services#handyman">Handyman Services</Link>
          <Link to="/services#cleaning">Cleaning Services</Link>
          <Link to="/services#shopping">Delivery & Errands</Link>
          <Link to="/services#assembly">Furniture Assembly</Link>
        </div>
        
        <div className="footer-col">
          <h4>TaskGH</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Terms & Privacy</a>
          <a href="#">Help Center</a>
        </div>

        <div className="footer-col">
          <h4>Social</h4>
          <div className="social-links">
            <a href="#"><Globe size={20} /></a>
            <a href="#"><Mail size={20} /></a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} TaskGH. All rights reserved.</p>
        <p className="momo-acc">Payments powered by MoMo & Paystack</p>
      </div>
    </footer>
  );
}
