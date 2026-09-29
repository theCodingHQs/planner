import React from 'react';
import { ShieldCheck, Tag } from 'lucide-react';

export default function FooterCompliance({ onOpenCompliance }) {
  return (
    <footer className="studio-compliance-footer">
      <div className="footer-left">
        <span className="footer-brand">PlanCraft Studio</span>
        <span className="footer-tagline">• Digital Planner Generator</span>
        <span className="footer-copy">© {new Date().getFullYear()} All Rights Reserved</span>
      </div>

      <nav className="footer-nav-links">
        <button 
          type="button" 
          className="footer-link-btn highlight-link"
          onClick={() => onOpenCompliance('plans')}
        >
          <Tag size={12} />
          <span>Plans & Pricing</span>
        </button>
        <button 
          type="button" 
          className="footer-link-btn"
          onClick={() => onOpenCompliance('about')}
        >
          About
        </button>
        <button 
          type="button" 
          className="footer-link-btn"
          onClick={() => onOpenCompliance('contact')}
        >
          Contact Support
        </button>
        <button 
          type="button" 
          className="footer-link-btn"
          onClick={() => onOpenCompliance('terms')}
        >
          Terms of Service
        </button>
        <button 
          type="button" 
          className="footer-link-btn"
          onClick={() => onOpenCompliance('privacy')}
        >
          Privacy Policy
        </button>
        <button 
          type="button" 
          className="footer-link-btn"
          onClick={() => onOpenCompliance('refund')}
        >
          Refund Policy
        </button>
        <button 
          type="button" 
          className="footer-link-btn"
          onClick={() => onOpenCompliance('shipping')}
        >
          Shipping & Delivery
        </button>
      </nav>
    </footer>
  );
}
