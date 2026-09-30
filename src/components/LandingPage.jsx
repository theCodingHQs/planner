import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarDays,
  Sparkles,
  Palette,
  Type,
  Download,
  Layout,
  Image as ImageIcon,
  Check,
  ArrowRight,
  Zap,
  ShieldCheck,
  Monitor,
  Lock,
  ExternalLink,
  Menu,
  X,
  Tag,
} from 'lucide-react';
import ComplianceModal from './ComplianceModal';
import { GUMROAD_PRODUCT_URL } from '../utils/gumroadService';
import heroImg from '../assets/hero.png';
import './LandingPage.css';

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Monthly calendars',
    desc: 'Dated monthly grids with custom titles, week start, events, stickers, and an optional notes column.',
  },
  {
    icon: Layout,
    title: 'Undated weekly layouts',
    desc: 'Four undated frameworks — 7 columns, 8-box grid, split horizontal, and a productivity dashboard with habits.',
  },
  {
    icon: Palette,
    title: 'Festival & seasonal themes',
    desc: 'Curated presets for Diwali, Hanukkah, Yule, Halloween, autumn, floral, minimal linen, celestial, and more.',
  },
  {
    icon: ImageIcon,
    title: 'Custom background art',
    desc: 'Upload your own artwork or pick from suggested images. Control opacity, filters, and how cells sit on the page.',
  },
  {
    icon: Type,
    title: 'Typography control',
    desc: 'Mix calligraphy scripts and clean sans fonts for titles, headers, and dates — live on the canvas.',
  },
  {
    icon: Download,
    title: 'Print-ready export (Pro)',
    desc: 'Unlock 300 DPI PDF, Ultra HD PNG, JPEG, and clipboard export. Save design templates as JSON for free anytime.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Open Studio',
    desc: 'No account needed. Launch the browser editor and start with a monthly calendar or undated weekly layout.',
  },
  {
    n: '02',
    title: 'Customize',
    desc: 'Apply a theme, upload artwork, tweak fonts and colors, and add events or stickers — everything autosaves locally.',
  },
  {
    n: '03',
    title: 'Export or unlock Pro',
    desc: 'Save your design template free. Unlock Pro once for print-ready PDF/PNG exports and commercial printing rights.',
  },
];

const FAQS = [
  {
    q: 'Do I need an account?',
    a: 'No. PlanCraft Studio runs in your browser. Designs autosave locally — no signup required.',
  },
  {
    q: 'What is free vs Pro?',
    a: 'Designing and previewing is free forever, including saving design templates (.json). Pro unlocks print-ready PDF, Ultra HD PNG, JPEG, and clipboard exports.',
  },
  {
    q: 'Can I sell planners on Etsy?',
    a: 'Yes with Pro. The Pro Lifetime Pass includes full personal and commercial printing rights so you can print and resell customized planners (for example on Etsy or Amazon KDP). Reselling the software itself is not allowed.',
  },
  {
    q: 'Is there a watermark?',
    a: 'Paid exports are unlocked cleanly with Pro — no watermark step. Free users can design freely and save JSON templates; image/PDF download requires Pro.',
  },
  {
    q: 'How does the license work?',
    a: 'Buy once on Gumroad ($9.99 lifetime). Paste your license key in Export → verify. The key stays in this browser until you clear it.',
  },
  {
    q: 'Is it browser-only?',
    a: 'Yes. Everything runs client-side in your browser. Works on desktop browsers; designs stay on your device via localStorage.',
  },
];

function openGumroad() {
  if (typeof window !== 'undefined' && window.GumroadOverlay) {
    window.GumroadOverlay.open({ url: GUMROAD_PRODUCT_URL });
  } else {
    window.open(GUMROAD_PRODUCT_URL, '_blank', 'noopener,noreferrer');
  }
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function LandingPage({ onOpenStudio }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [complianceTab, setComplianceTab] = useState('plans');
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openStudio = useCallback(() => {
    if (onOpenStudio) onOpenStudio();
    else window.location.hash = 'studio';
  }, [onOpenStudio]);

  const openCompliance = (tab = 'plans') => {
    setComplianceTab(tab);
    setComplianceOpen(true);
    setMenuOpen(false);
  };

  const navTo = (id) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <div className="lp-root">
      <header className={`lp-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <a
            href="/"
            className="lp-brand"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="lp-brand-icon" aria-hidden="true">
              <CalendarDays size={18} />
            </span>
            <span className="lp-brand-text">
              <span className="lp-brand-title">PlanCraft</span>
              <span className="lp-brand-sub">STUDIO</span>
            </span>
          </a>

          <nav className="lp-nav-links" aria-label="Primary">
            <button type="button" onClick={() => navTo('features')}>Features</button>
            <button type="button" onClick={() => navTo('how')}>How it works</button>
            <button type="button" onClick={() => navTo('pricing')}>Pricing</button>
            <button type="button" onClick={() => navTo('faq')}>FAQ</button>
          </nav>

          <div className="lp-nav-actions">
            <button type="button" className="lp-btn lp-btn-ghost" onClick={openStudio}>
              Open Studio
            </button>
            <a
              href={GUMROAD_PRODUCT_URL}
              className="lp-btn lp-btn-primary gumroad-button"
              data-gumroad-product-id="dnGtiCmOYDAznVYMxfcz8A=="
              onClick={(e) => {
                e.preventDefault();
                openGumroad();
              }}
            >
              Get Pro
            </a>
            <button
              type="button"
              className="lp-menu-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lp-mobile-menu">
            <button type="button" onClick={() => navTo('features')}>Features</button>
            <button type="button" onClick={() => navTo('how')}>How it works</button>
            <button type="button" onClick={() => navTo('pricing')}>Pricing</button>
            <button type="button" onClick={() => navTo('faq')}>FAQ</button>
            <button type="button" className="lp-btn lp-btn-ghost" onClick={openStudio}>
              Open Studio
            </button>
            <button type="button" className="lp-btn lp-btn-primary" onClick={openGumroad}>
              Get Pro — $9.99
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="lp-hero">
          <div className="lp-hero-glow" aria-hidden="true" />
          <div className="lp-hero-grid">
            <div className="lp-hero-copy">
              <p className="lp-eyebrow">
                <Sparkles size={14} />
                For printable planner creators &amp; Etsy sellers
              </p>
              <h1>
                Design print-ready planners
                <span className="lp-hero-accent"> in your browser</span>
              </h1>
              <p className="lp-hero-sub">
                PlanCraft Studio is a free client-side editor for aesthetic monthly calendars
                and undated weekly layouts. Customize themes, artwork, and typography —
                unlock Pro once for crisp PDF/PNG export and commercial printing rights.
              </p>
              <div className="lp-hero-cta">
                <button type="button" className="lp-btn lp-btn-primary lp-btn-lg" onClick={openStudio}>
                  Start designing free
                  <ArrowRight size={18} />
                </button>
                <a
                  href={GUMROAD_PRODUCT_URL}
                  className="lp-btn lp-btn-outline lp-btn-lg gumroad-button"
                  onClick={(e) => {
                    e.preventDefault();
                    openGumroad();
                  }}
                >
                  <Zap size={16} />
                  Get Pro — $9.99
                </a>
              </div>
              <ul className="lp-hero-bullets">
                <li><Check size={14} /> No account required</li>
                <li><Check size={14} /> Design forever free</li>
                <li><Check size={14} /> Lifetime Pro license</li>
              </ul>
            </div>

            <div className="lp-hero-visual" aria-hidden="true">
              <div className="lp-mock-stack">
                <div className="lp-mock-card lp-mock-monthly">
                  <div className="lp-mock-header">
                    <span className="lp-mock-title">October</span>
                    <span className="lp-mock-year">2026</span>
                  </div>
                  <div className="lp-mock-weekdays">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <span key={`wd-${i}`}>{d}</span>
                    ))}
                  </div>
                  <div className="lp-mock-grid">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <span key={`c-${i}`} className={i >= 3 && i <= 33 ? 'filled' : 'empty'} />
                    ))}
                  </div>
                </div>
                <div className="lp-mock-card lp-mock-weekly">
                  <div className="lp-mock-header">
                    <span className="lp-mock-title">Weekly</span>
                    <span className="lp-mock-pill">Undated</span>
                  </div>
                  <div className="lp-mock-cols">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => (
                      <div key={d} className="lp-mock-col">
                        <strong>{d}</strong>
                        <i /><i /><i />
                      </div>
                    ))}
                  </div>
                </div>
                {heroImg && (
                  <img
                    src={heroImg}
                    alt=""
                    className="lp-hero-thumb"
                    width={120}
                    height={80}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="lp-proof" aria-label="Highlights">
          <div className="lp-proof-inner">
            <div className="lp-proof-item">
              <Monitor size={18} />
              <span>Works in your browser</span>
            </div>
            <div className="lp-proof-item">
              <ShieldCheck size={18} />
              <span>No account required</span>
            </div>
            <div className="lp-proof-item">
              <Tag size={18} />
              <span>Built for printable sellers</span>
            </div>
            <div className="lp-proof-item">
              <Lock size={18} />
              <span>Designs stay on your device</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="lp-section">
          <div className="lp-section-head">
            <p className="lp-eyebrow">Features</p>
            <h2>Everything you need to craft sellable planners</h2>
            <p className="lp-section-sub">
              Honest feature set from the live studio — monthly calendars, undated weeklies,
              themes, artwork, typography, and Pro export.
            </p>
          </div>
          <div className="lp-features-grid">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <article key={f.title} className="lp-feature-card">
                  <div className="lp-feature-icon">
                    <Icon size={20} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="lp-section lp-section-alt">
          <div className="lp-section-head">
            <p className="lp-eyebrow">How it works</p>
            <h2>Three steps from blank page to print shop</h2>
          </div>
          <div className="lp-steps">
            {STEPS.map((s) => (
              <article key={s.n} className="lp-step-card">
                <span className="lp-step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
          <div className="lp-section-cta">
            <button type="button" className="lp-btn lp-btn-primary lp-btn-lg" onClick={openStudio}>
              Start designing
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="lp-section">
          <div className="lp-section-head">
            <p className="lp-eyebrow">Pricing</p>
            <h2>Simple pricing. No subscriptions.</h2>
            <p className="lp-section-sub">
              Design forever free. Pay once for print-ready exports and commercial rights.
            </p>
          </div>
          <div className="lp-pricing-grid">
            <article className="lp-price-card">
              <div className="lp-price-badge muted">FREE ACCESS</div>
              <h3>Studio Free</h3>
              <div className="lp-price">
                <span className="lp-currency">$</span>
                <span className="lp-amount">0</span>
                <span className="lp-freq">/ free forever</span>
              </div>
              <p className="lp-price-desc">
                Full access to design, preview, and customize unlimited monthly and weekly planners.
              </p>
              <ul className="lp-price-list">
                <li><Check size={14} /> Interactive canvas &amp; real-time customizer</li>
                <li><Check size={14} /> Monthly calendar &amp; 4 weekly layouts</li>
                <li><Check size={14} /> Custom background upload, opacity &amp; themes</li>
                <li><Check size={14} /> Save &amp; reload design templates (.json)</li>
              </ul>
              <button type="button" className="lp-btn lp-btn-outline lp-btn-block" onClick={openStudio}>
                Open Studio free
              </button>
            </article>

            <article className="lp-price-card featured">
              <div className="lp-price-badge accent">RECOMMENDED</div>
              <h3>Pro Lifetime Pass</h3>
              <div className="lp-price">
                <span className="lp-currency">$</span>
                <span className="lp-amount">9.99</span>
                <span className="lp-freq">/ one-time</span>
              </div>
              <p className="lp-price-desc">
                Lifetime unlimited exports for monthly and weekly planners with instant Gumroad delivery.
              </p>
              <ul className="lp-price-list">
                <li><Check size={14} /> <strong>Unlimited</strong> 300 DPI vector PDF exports</li>
                <li><Check size={14} /> <strong>Unlimited</strong> 3× lossless Ultra HD PNGs</li>
                <li><Check size={14} /> US Letter Landscape &amp; A4 print sizes</li>
                <li><Check size={14} /> Full personal and commercial printing rights</li>
                <li><Check size={14} /> Future layout additions &amp; seasonal themes</li>
              </ul>
              <a
                href={GUMROAD_PRODUCT_URL}
                className="lp-btn lp-btn-primary lp-btn-block gumroad-button"
                onClick={(e) => {
                  e.preventDefault();
                  openGumroad();
                }}
              >
                <Zap size={16} />
                Unlock Pro on Gumroad
                <ExternalLink size={14} />
              </a>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="lp-section lp-section-alt">
          <div className="lp-section-head">
            <p className="lp-eyebrow">FAQ</p>
            <h2>Quick answers</h2>
          </div>
          <div className="lp-faq-list">
            {FAQS.map((item, idx) => {
              const open = openFaq === idx;
              return (
                <div key={item.q} className={`lp-faq-item ${open ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="lp-faq-q"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? -1 : idx)}
                  >
                    <span>{item.q}</span>
                    <span className="lp-faq-chevron" aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                  {open && <p className="lp-faq-a">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="lp-bottom-cta">
          <h2>Ready to craft your next printable?</h2>
          <p>Open the studio free — upgrade only when you need print-ready export.</p>
          <div className="lp-hero-cta">
            <button type="button" className="lp-btn lp-btn-primary lp-btn-lg" onClick={openStudio}>
              Start designing free
              <ArrowRight size={18} />
            </button>
            <button type="button" className="lp-btn lp-btn-outline lp-btn-lg" onClick={openGumroad}>
              Get Pro — $9.99
            </button>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <span className="lp-brand-title">PlanCraft Studio</span>
            <span className="lp-footer-tag">Digital planner generator</span>
            <span className="lp-footer-copy">© {new Date().getFullYear()} All rights reserved</span>
          </div>
          <nav className="lp-footer-nav" aria-label="Footer">
            <button type="button" onClick={openStudio}>Open Studio</button>
            <a href={GUMROAD_PRODUCT_URL} target="_blank" rel="noopener noreferrer">Gumroad</a>
            <button type="button" onClick={() => openCompliance('plans')}>Pricing</button>
            <button type="button" onClick={() => openCompliance('terms')}>Terms</button>
            <button type="button" onClick={() => openCompliance('privacy')}>Privacy</button>
            <button type="button" onClick={() => openCompliance('refund')}>Refund</button>
            <button type="button" onClick={() => openCompliance('contact')}>Contact</button>
          </nav>
        </div>
      </footer>

      <ComplianceModal
        isOpen={complianceOpen}
        onClose={() => setComplianceOpen(false)}
        initialTab={complianceTab}
      />
    </div>
  );
}
