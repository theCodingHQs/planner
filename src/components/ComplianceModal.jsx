import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Mail,
  FileText,
  RefreshCw,
  Truck,
  Info,
  Check,
  Tag,
  CreditCard,
  ExternalLink,
} from "lucide-react";

export default function ComplianceModal({
  isOpen,
  onClose,
  initialTab = "plans",
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync activeTab whenever modal opens or a different policy link is clicked
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const tabs = [
    { id: "plans", label: "Pricing & Plans", icon: Tag },
    { id: "about", label: "About Us", icon: Info },
    { id: "contact", label: "Contact Us", icon: Mail },
    { id: "terms", label: "Terms & Conditions", icon: FileText },
    { id: "privacy", label: "Privacy Policy", icon: ShieldCheck },
    { id: "refund", label: "Refund & Cancellation", icon: RefreshCw },
    { id: "shipping", label: "Shipping & Delivery", icon: Truck },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-window compliance-modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <ShieldCheck size={22} className="text-orange-500" />
            <div>
              <h3>PlanCraft Studio — Policies & Pricing</h3>
              <p className="modal-subtitle">
                Official business information, pricing plans, and compliance
                policies
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="compliance-tab-bar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`compliance-tab-btn ${isActive ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div
          className="modal-body compliance-modal-body"
          style={{ maxHeight: "65vh", overflowY: "auto", padding: "24px 28px" }}
        >
          {/* TAB 1: PRICING & PLANS */}
          {activeTab === "plans" && (
            <div className="compliance-section animate-fade-in">
              <div className="compliance-section-header">
                <h4>Pricing & Access Plans</h4>
                <p>
                  Simple, transparent pricing with no recurring monthly subscriptions or hidden charges.
                </p>
              </div>

              <div className="compliance-plans-grid">
                {/* Plan 1: Free Starter */}
                <div className="compliance-plan-card">
                  <div className="plan-badge-muted">FREE ACCESS</div>
                  <h5 className="plan-name">Studio Free</h5>
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">0</span>
                    <span className="frequency">/ free forever</span>
                  </div>
                  <p className="plan-desc">
                    Full access to design, preview, and customize unlimited monthly and weekly planners.
                  </p>

                  <ul className="plan-features-list">
                    <li>
                      <Check size={14} className="text-orange-500" /> Full
                      interactive canvas & real-time customizer
                    </li>
                    <li>
                      <Check size={14} className="text-orange-500" /> Monthly
                      calendar & 4 weekly planner layouts
                    </li>
                    <li>
                      <Check size={14} className="text-orange-500" /> Custom
                      background upload, opacity & themes
                    </li>
                    <li>
                      <Check size={14} className="text-orange-500" /> Save &
                      reload design templates (.json)
                    </li>
                  </ul>
                </div>

                {/* Plan 2: Pro Lifetime (Single Paid Plan) */}
                <div className="compliance-plan-card featured-plan">
                  <div className="plan-badge-accent">RECOMMENDED</div>
                  <h5 className="plan-name">Pro Lifetime Pass</h5>
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">9.99</span>
                    <span className="frequency">/ one-time pay once</span>
                  </div>
                  <p className="plan-desc">
                    Lifetime unlimited exports for all Monthly and Weekly planners with instant Gumroad delivery.
                  </p>

                  <ul className="plan-features-list">
                    <li>
                      <Check size={14} className="text-orange-500" />{" "}
                      <strong>Unlimited</strong> 300 DPI Vector PDF Exports
                    </li>
                    <li>
                      <Check size={14} className="text-orange-500" />{" "}
                      <strong>Unlimited</strong> 3x Lossless Ultra HD PNGs
                    </li>
                    <li>
                      <Check size={14} className="text-orange-500" /> Standard
                      US Letter Landscape & A4 Print sizes
                    </li>
                    <li>
                      <Check size={14} className="text-orange-500" /> Full
                      personal and commercial printing rights
                    </li>
                    <li>
                      <Check size={14} className="text-orange-500" /> All
                      future layout additions & seasonal themes
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pro-tip-box" style={{ marginTop: "20px" }}>
                <CreditCard size={18} className="text-amber-500" />
                <div>
                  <strong>Secure Global Payment Processing:</strong>
                  <p>
                    All payments are securely processed globally via Gumroad
                    (Merchant of Record). We support Credit/Debit Cards (Visa,
                    Mastercard, Amex), Apple Pay, Google Pay, and PayPal with
                    instant automatic license key delivery.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT US */}
          {activeTab === "about" && (
            <div className="compliance-section animate-fade-in">
              <div className="compliance-section-header">
                <h4>About PlanCraft Studio</h4>
              </div>
              <p>
                <strong>PlanCraft Studio</strong> is an interactive web-based
                digital design platform that empowers individuals, creators, and
                small businesses to generate bespoke, print-ready monthly
                calendars and weekly organizers.
              </p>
              <p style={{ marginTop: "12px" }}>
                With support for international cultural festivals (Diwali,
                Hanukkah, Yule Solstice, St. Nicholas Day, Epiphany, Spooky
                Halloween, and seasonal themes), PlanCraft Studio produces
                professional 300 DPI vector-sharp PDF and PNG exports ready for
                home printing and digital tablet apps (GoodNotes, Notability).
              </p>
              <div
                className="compliance-info-card"
                style={{ marginTop: "18px" }}
              >
                <strong>Platform Highlights:</strong>
                <ul>
                  <li>
                    Ultra-responsive live artboard customizer with real-time
                    typography and opacity control.
                  </li>
                  <li>
                    Undated and dated weekly planning architecture with
                    integrated habit trackers.
                  </li>
                  <li>
                    Seamless export in standard print dimensions (US Letter
                    Landscape and A4).
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT US */}
          {activeTab === "contact" && (
            <div className="compliance-section animate-fade-in">
              <div className="compliance-section-header">
                <h4>Contact Us & Customer Support</h4>
                <p>
                  We are here to assist with any questions, licensing queries,
                  or technical issues.
                </p>
              </div>

              <div className="compliance-contact-grid">
                <div className="contact-info-tile">
                  <Mail size={18} className="text-orange-500" />
                  <div>
                    <strong>Customer Support Email</strong>
                    <p>
                      <a
                        href="mailto:support@plancraft.app"
                        style={{ color: "var(--accent-orange)" }}
                      >
                        support@plancraft.app
                      </a>
                    </p>
                    <span className="subtext">
                      We typically reply within 24 to 48 business hours.
                    </span>
                  </div>
                </div>

                <div className="contact-info-tile">
                  <ShieldCheck size={18} className="text-orange-500" />
                  <div>
                    <strong>Operating Hours</strong>
                    <p>Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
                    <span className="subtext">
                      Online support tickets are monitored daily.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pro-tip-box" style={{ marginTop: "18px" }}>
                <Info size={16} className="text-amber-500" />
                <p>
                  For transaction or payment receipt inquiries, please include
                  your <strong>Razorpay Payment ID</strong> (e.g.{" "}
                  <code>pay_xxx</code>) in your email for rapid assistance.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: TERMS & CONDITIONS */}
          {activeTab === "terms" && (
            <div className="compliance-section animate-fade-in">
              <div className="compliance-section-header">
                <h4>Terms and Conditions</h4>
                <span className="subtext">Last updated: October 2026</span>
              </div>
              <div className="legal-text-block">
                <h5>1. Acceptance of Terms</h5>
                <p>
                  By accessing and utilizing PlanCraft Studio ("the Service"),
                  you agree to abide by these Terms and Conditions and our
                  Privacy Policy. If you do not agree, please do not use the
                  Service.
                </p>

                <h5>2. Nature of Digital Goods</h5>
                <p>
                  PlanCraft Studio provides online design tools and downloadable
                  digital assets (PDF documents, PNG/JPEG graphics, and design
                  templates). All products sold through this platform are
                  digital goods delivered electronically.
                </p>

                <h5>3. License Grants & Permitted Usage</h5>
                <p>
                  <strong>Personal License:</strong> Files generated under the
                  Starter Plan may be printed and used for personal or household
                  organization.
                  <br />
                  <strong>Commercial License:</strong> Users with a Pro
                  All-Access Pass are granted non-exclusive rights to print and
                  physically or digitally resell customized planners created on
                  the platform (e.g. Etsy, Amazon KDP, local print shops).
                  Reselling the raw software source code is strictly prohibited.
                </p>

                <h5>4. User Conduct & Uploaded Content</h5>
                <p>
                  You retain full rights to any photos or graphics you upload to
                  the studio. You warrant that any uploaded assets do not
                  infringe third-party copyrights or intellectual property
                  rights.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="compliance-section animate-fade-in">
              <div className="compliance-section-header">
                <h4>Privacy Policy</h4>
                <span className="subtext">Last updated: October 2026</span>
              </div>
              <div className="legal-text-block">
                <h5>1. Information We Collect</h5>
                <p>
                  We respect your privacy. PlanCraft Studio operates primarily
                  on client-side state. When initiating a payment, your email
                  address, phone number, and name are collected securely through
                  our payment partner, Razorpay, strictly for processing
                  payments and issuing transaction receipts.
                </p>

                <h5>2. Data Security & Storage</h5>
                <p>
                  Your designs and text notes are stored locally in your browser
                  cache (localStorage). We do not store or sell your personal
                  notes, calendar events, or payment credentials on any external
                  ad-tracking servers.
                </p>

                <h5>3. Payment Data Security</h5>
                <p>
                  All financial transactions are handled directly through
                  Razorpay's PCI-DSS compliant payment gateway. PlanCraft Studio
                  never captures or stores your credit/debit card numbers, UPI
                  PINs, or bank account credentials.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: REFUND & CANCELLATION */}
          {activeTab === "refund" && (
            <div className="compliance-section animate-fade-in">
              <div className="compliance-section-header">
                <h4>Refund & Cancellation Policy</h4>
                <span className="subtext">Last updated: October 2026</span>
              </div>
              <div className="legal-text-block">
                <h5>Digital Goods Policy</h5>
                <p>
                  Since PlanCraft Studio delivers intangible, irrevocable
                  digital goods via instantaneous browser download, orders are
                  generally non-refundable once the file export has completed.
                </p>

                <h5>7-Day Technical Failure Guarantee</h5>
                <p>
                  We stand by our print quality. If you encounter any technical
                  glitch preventing you from exporting your file, or if the
                  exported document is corrupted, please reach out to us at{" "}
                  <a
                    href="mailto:support@plancraft.app"
                    style={{ color: "var(--accent-orange)" }}
                  >
                    support@plancraft.app
                  </a>{" "}
                  within <strong>7 days of purchase</strong>.
                </p>
                <p>
                  Upon verifying the technical issue, we will either provide a
                  corrected high-resolution file or issue a{" "}
                  <strong>100% full refund</strong> back to your original
                  payment method via Razorpay within 5–7 business days.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: SHIPPING & DELIVERY */}
          {activeTab === "shipping" && (
            <div className="compliance-section animate-fade-in">
              <div className="compliance-section-header">
                <h4>Shipping & Delivery Policy</h4>
                <span className="subtext">Last updated: October 2026</span>
              </div>
              <div className="legal-text-block">
                <h5>Instant Digital Delivery (No Physical Shipping)</h5>
                <p>
                  PlanCraft Studio exclusively offers electronic software
                  services and downloadable digital goods.{" "}
                  <strong>
                    No physical products (paper planners, binders, or
                    merchandise) are shipped to any postal address.
                  </strong>
                </p>

                <h5>Delivery Timeline & Access</h5>
                <p>
                  Upon successful payment completion through Razorpay, your
                  high-resolution planner (PDF, PNG, or JPEG) is unlocked and
                  downloaded instantaneously directly in your browser. A
                  confirmation receipt with your transaction ID is also sent to
                  your registered email address immediately.
                </p>
                <p>
                  Because delivery is automated and immediate, there are zero
                  shipping fees or postal customs charges.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
