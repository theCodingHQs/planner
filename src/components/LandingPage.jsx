import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarDays,
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
  Printer,
  Tablet,
  Store,
  Home,
  FileText,
  Sliders,
  Layers,
  CheckCircle2,
  Minus,
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

const LAYOUT_PREVIEWS = [
  {
    id: 'monthly',
    name: 'Dated Monthly Calendar',
    badge: 'Classic Calendar',
    tagline: 'Precision 5- or 6-week dated grid with live events and notes column',
    mode: 'monthly',
    layout: null,
    highlights: [
      'Configurable week start (Monday vs. Sunday)',
      'Custom title, subtitle & year in luxury script or serif fonts',
      'Event markers, stickers & optional ruled notes column',
      'Hide outer empty days for a floating, minimal aesthetic',
    ],
  },
  {
    id: 'weekly-7col',
    name: '7-Column Weekly Spread',
    badge: 'Undated Framework',
    tagline: 'Equal columns for Monday through Sunday with lined task sections',
    mode: 'weekly',
    layout: 'columns-7',
    highlights: [
      'Balanced 7-day horizontal overview across the page',
      'Adjustable ruled line spacing, borders, and fills',
      'Ideal for lesson planning and daily appointment tracking',
      'Pre-calibrated for US Letter Landscape or A4 printing',
    ],
  },
  {
    id: 'weekly-8box',
    name: '8-Box Grid & Notes',
    badge: 'Undated Framework',
    tagline: 'Clean 2×4 boxed dashboard with dedicated weekend and goal blocks',
    mode: 'weekly',
    layout: 'grid-8',
    highlights: [
      '7 distinct daily boxes + 1 generous notes & priorities box',
      'Perfect balance between schedule and freeform thoughts',
      'Customizable rounded corners, borders, and fills',
      'Bestselling layout for bullet journaling & GoodNotes stickers',
    ],
  },
  {
    id: 'weekly-split',
    name: 'Split Horizontal Rows',
    badge: 'Undated Framework',
    tagline: 'Wide horizontal planning lanes for detailed daily journaling',
    mode: 'weekly',
    layout: 'horizontal',
    highlights: [
      'Spacious horizontal rows for deep daily focus & time-blocking',
      'Dedicated weekly goals and sidebar focus section',
      'Clean typography with handwritten or modern sans labels',
      'Great for meal planners, workout logs & project milestones',
    ],
  },
  {
    id: 'weekly-productivity',
    name: 'Productivity & Habit Dashboard',
    badge: 'Undated Framework',
    tagline: 'All-in-one cockpit with Top 3 goals, daily habit dots & to-do list',
    mode: 'weekly',
    layout: 'dashboard',
    highlights: [
      'Top 3 Weekly Priorities banner at the top',
      'Daily 7-day habit tracker matrix with checkboxes',
      'Actionable to-do checklist and upcoming milestones',
      'Engineered for freelancers, solopreneurs, and students',
    ],
  },
];

const THEME_SHOWCASE = [
  {
    id: 'halloween',
    name: 'Spooky Halloween',
    tag: 'Autumn Bestseller',
    bg: '/templates/halloween.jpg',
    fonts: 'Great Vibes & Cinzel',
    palette: ['#e07a14', '#1a100a', '#ffffff'],
    description: 'Vintage gothic warmth with rich autumnal accents and elegant script headings.',
  },
  {
    id: 'diwali',
    name: 'Festival of Lights (Diwali)',
    tag: 'Celebration',
    bg: '/templates/diwali.jpg',
    fonts: 'Playfair Display & Cinzel',
    palette: ['#d97706', '#78350f', '#fffbeb'],
    description: 'Radiant golden illumination with celebratory amber framing and serif luxury.',
  },
  {
    id: 'floral',
    name: 'Botanical Floral Bloom',
    tag: 'Year-Round Aesthetic',
    bg: '/templates/floral.jpg',
    fonts: 'Great Vibes & Outfit',
    palette: ['#059669', '#064e3b', '#f0fdf4'],
    description: 'Delicate foliage and fresh botanical greens for tranquil, mindful daily planning.',
  },
  {
    id: 'autumn',
    name: 'Cozy Autumn Warmth',
    tag: 'Seasonal Favorite',
    bg: '/templates/autumn.jpg',
    fonts: 'Satisfy & Cinzel',
    palette: ['#ea580c', '#431407', '#fff7ed'],
    description: 'Crisp fallen leaves, cinnamon tones, and rustic textures for October & November.',
  },
  {
    id: 'hanukkah',
    name: 'Hanukkah Lights',
    tag: 'Winter Holidays',
    bg: '/templates/hanukkah.jpg',
    fonts: 'Cinzel & Outfit',
    palette: ['#2563eb', '#1e3a8a', '#eff6ff'],
    description: 'Deep royal blue serenity, shimmering candlelight, and classical typography.',
  },
  {
    id: 'yule',
    name: 'Yule & Winter Solstice',
    tag: 'Evergreen Calm',
    bg: '/templates/yule.jpg',
    fonts: 'Cormorant Garamond & Outfit',
    palette: ['#15803d', '#14532d', '#f0fdf4'],
    description: 'Frosted pine, quiet winter evenings, and understated minimalist elegance.',
  },
];

const PRINT_SPECS = [
  {
    icon: Printer,
    title: '300 DPI Vector PDF',
    badge: 'Sharp Precision',
    desc: 'Export calibrated vectors with razor-sharp lines and text that never pixelate on commercial home or print-shop presses.',
  },
  {
    icon: Tablet,
    title: '3× Lossless Ultra HD PNG',
    badge: 'Tablet & iPad',
    desc: 'Rendered at over 3300×2550 pixels — perfectly optimized for GoodNotes 6, Notability, and Penly stylus writing.',
  },
  {
    icon: FileText,
    title: 'US Letter & A4 Formats',
    badge: 'Global Standard',
    desc: 'Pre-calibrated landscape ratios for standard 8.5×11" US Letter and 210×297mm international A4 paper with safe printing margins.',
  },
  {
    icon: ShieldCheck,
    title: '100% Client-Side Privacy',
    badge: 'Zero Cloud Storage',
    desc: 'Your photos, family events, and personal notes stay strictly in your browser. Zero tracking, zero latency, zero cloud upload required.',
  },
];

const AUDIENCE_CARDS = [
  {
    icon: Store,
    title: 'Printable & Etsy Sellers',
    desc: 'Generate distinctive, aesthetic monthly and weekly calendar products in minutes. The Pro license includes full commercial reselling rights for digital downloads and physical prints.',
    tag: 'Passive Income',
  },
  {
    icon: Tablet,
    title: 'Digital Journalers & GoodNotes Users',
    desc: 'Tired of bloated 400-page PDF planners with links you never use? Craft the exact one-page or weekly spread you need, export in 3× Ultra HD, and import directly to your iPad.',
    tag: 'Minimal Digital Planning',
  },
  {
    icon: Home,
    title: 'Busy Homes, Students & Freelancers',
    desc: 'Print fresh, beautifully organized weekly meal plans, study timetables, chore trackers, and monthly event boards without fighting rigid spreadsheet templates.',
    tag: 'Daily Productivity',
  },
];

const COMPARISON_ROWS = [
  { feature: 'Interactive Canvas Editor & Live Real-Time Customizer', free: true, pro: true },
  { feature: 'Dated Monthly Calendar Generator (2026–2030+)', free: true, pro: true },
  { feature: '4 Undated Weekly Frameworks (7-Col, 8-Box, Split, Habit)', free: true, pro: true },
  { feature: 'Curated Festival & Seasonal Themes (Halloween, Diwali, etc.)', free: true, pro: true },
  { feature: 'Custom Artwork Upload & Real-Time Photo Filters', free: true, pro: true },
  { feature: 'Calligraphy Scripts & Sans-Serif Font Library', free: true, pro: true },
  { feature: 'Save & Reload Design Templates (.json files)', free: true, pro: true },
  { feature: 'Print-Ready 300 DPI Vector PDF Export', free: false, pro: 'Unlimited' },
  { feature: '3× Lossless Ultra HD PNG & JPEG Export', free: false, pro: 'Unlimited' },
  { feature: 'Direct-to-Clipboard Instant Image Copy', free: false, pro: 'Unlimited' },
  { feature: 'Commercial Printing & Resell Rights (Etsy / Gumroad)', free: false, pro: 'Included Lifetime' },
  { feature: 'Future Layouts & Seasonal Theme Upgrades', free: true, pro: true },
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
    q: 'Can I sell planners on Etsy or Gumroad?',
    a: 'Yes with Pro. The Pro Lifetime Pass includes full personal and commercial printing rights so you can print and resell customized planners (for example on Etsy or Amazon KDP). Reselling the software itself is not allowed.',
  },
  {
    q: 'Can I use PlanCraft on an iPad or tablet?',
    a: 'Yes! You can design and export Ultra HD PNGs or PDFs directly into GoodNotes, Notability, or Penly for a clean, handwritten digital planning experience.',
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
  const [activeLayout, setActiveLayout] = useState('monthly');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openStudio = useCallback((opts) => {
    if (onOpenStudio) onOpenStudio(opts);
    else {
      if (opts?.themeId) {
        window.location.hash = `studio?theme=${opts.themeId}`;
      } else if (opts?.mode) {
        window.location.hash = `studio?mode=${opts.mode}${opts.layout ? `&layout=${opts.layout}` : ''}`;
      } else {
        window.location.hash = 'studio';
      }
    }
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

  const currentLayout = LAYOUT_PREVIEWS.find((l) => l.id === activeLayout) || LAYOUT_PREVIEWS[0];

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
            <button type="button" onClick={() => navTo('layouts')}>Layouts</button>
            <button type="button" onClick={() => navTo('themes')}>Themes</button>
            <button type="button" onClick={() => navTo('features')}>Features</button>
            <button type="button" onClick={() => navTo('specs')}>Specs</button>
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
            <button type="button" onClick={() => navTo('layouts')}>Layouts</button>
            <button type="button" onClick={() => navTo('themes')}>Themes</button>
            <button type="button" onClick={() => navTo('features')}>Features</button>
            <button type="button" onClick={() => navTo('specs')}>Specs</button>
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
                <Printer size={14} />
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

        {/* Interactive Layout Showcase */}
        <section id="layouts" className="lp-section">
          <div className="lp-section-head">
            <p className="lp-eyebrow">Planner Frameworks</p>
            <h2>Two formats. Infinite variations.</h2>
            <p className="lp-section-sub">
              Switch effortlessly between precision dated monthly calendars and four undated weekly productivity layouts.
            </p>
          </div>

          <div className="lp-layout-switcher">
            <div className="lp-layout-tabs" role="tablist" aria-label="Planner Frameworks">
              {LAYOUT_PREVIEWS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  role="tab"
                  aria-selected={activeLayout === l.id}
                  className={`lp-layout-tab ${activeLayout === l.id ? 'active' : ''}`}
                  onClick={() => setActiveLayout(l.id)}
                >
                  {l.name}
                </button>
              ))}
            </div>

            <div className="lp-layout-display">
              <div className="lp-layout-info">
                <div className="lp-layout-badge">{currentLayout.badge}</div>
                <h3>{currentLayout.name}</h3>
                <p className="lp-layout-tagline">{currentLayout.tagline}</p>
                <ul className="lp-layout-highlights">
                  {currentLayout.highlights.map((h, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={16} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="lp-btn lp-btn-primary"
                  onClick={() => openStudio({ mode: currentLayout.mode, layout: currentLayout.layout })}
                >
                  Customize in Studio
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="lp-layout-mockup" aria-hidden="true">
                <div className="lp-mockup-frame">
                  {currentLayout.id === 'monthly' && (
                    <div className="lp-demo-monthly">
                      <div className="lp-demo-header">
                        <h4>October 2026</h4>
                        <span className="lp-demo-pill">Monthly Grid</span>
                      </div>
                      <div className="lp-demo-weekdays">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                          <span key={d}>{d}</span>
                        ))}
                      </div>
                      <div className="lp-demo-cells">
                        {Array.from({ length: 35 }).map((_, i) => (
                          <div key={i} className={`lp-demo-cell ${i >= 3 && i <= 33 ? 'active' : 'dim'}`}>
                            <span className="lp-demo-date">{i >= 3 && i <= 33 ? i - 2 : ''}</span>
                            {i === 12 && <span className="lp-demo-event">Review</span>}
                            {i === 24 && <span className="lp-demo-event amber">Launch</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentLayout.id === 'weekly-7col' && (
                    <div className="lp-demo-weekly-cols">
                      <div className="lp-demo-header">
                        <h4>Weekly Spread</h4>
                        <span className="lp-demo-pill">7 Columns</span>
                      </div>
                      <div className="lp-demo-7cols-grid">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                          <div key={d} className="lp-demo-col-lane">
                            <strong>{d}</strong>
                            <div className="lp-demo-lane-lines">
                              <i /><i /><i /><i /><i />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentLayout.id === 'weekly-8box' && (
                    <div className="lp-demo-weekly-boxes">
                      <div className="lp-demo-header">
                        <h4>Weekly Overview</h4>
                        <span className="lp-demo-pill">8-Box Dashboard</span>
                      </div>
                      <div className="lp-demo-8box-grid">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Notes & Goals'].map((title, i) => (
                          <div key={title} className={`lp-demo-box ${i === 7 ? 'highlight' : ''}`}>
                            <strong>{title}</strong>
                            <div className="lp-demo-lane-lines">
                              <i /><i /><i />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentLayout.id === 'weekly-split' && (
                    <div className="lp-demo-weekly-split">
                      <div className="lp-demo-header">
                        <h4>Horizontal Schedule</h4>
                        <span className="lp-demo-pill">Split Layout</span>
                      </div>
                      <div className="lp-demo-split-grid">
                        <div className="lp-demo-split-sidebar">
                          <strong>Weekly Focus</strong>
                          <div className="lp-demo-lane-lines">
                            <i /><i /><i />
                          </div>
                          <strong style={{ marginTop: 12 }}>Top Priorities</strong>
                          <div className="lp-demo-lane-lines">
                            <i /><i />
                          </div>
                        </div>
                        <div className="lp-demo-split-rows">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Weekend'].map((day) => (
                            <div key={day} className="lp-demo-split-row">
                              <strong>{day}</strong>
                              <i />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentLayout.id === 'weekly-productivity' && (
                    <div className="lp-demo-weekly-prod">
                      <div className="lp-demo-header">
                        <h4>Productivity Cockpit</h4>
                        <span className="lp-demo-pill">Habits &amp; Goals</span>
                      </div>
                      <div className="lp-demo-prod-priorities">
                        <strong>🎯 Top 3 Priorities:</strong>
                        <span>1. Product Ship</span>
                        <span>2. Marketing Outreach</span>
                        <span>3. Weekly Review</span>
                      </div>
                      <div className="lp-demo-prod-habits">
                        <strong>Daily Habits</strong>
                        <div className="lp-demo-habit-row">
                          <span>Hydrate (2L)</span>
                          <div className="lp-demo-dots">{[...Array(7)].map((_, i) => <b key={i} className={i < 5 ? 'done' : ''} />)}</div>
                        </div>
                        <div className="lp-demo-habit-row">
                          <span>30m Movement</span>
                          <div className="lp-demo-dots">{[...Array(7)].map((_, i) => <b key={i} className={i < 4 ? 'done' : ''} />)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="lp-section lp-section-alt">
          <div className="lp-section-head">
            <p className="lp-eyebrow">Studio Features</p>
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

        {/* Theme Showcase */}
        <section id="themes" className="lp-section">
          <div className="lp-section-head">
            <p className="lp-eyebrow">Presets &amp; Themes</p>
            <h2>Curated seasonal &amp; aesthetic palettes</h2>
            <p className="lp-section-sub">
              Launch right away with pre-designed festival backdrops, harmonious color palettes, and curated typography.
            </p>
          </div>

          <div className="lp-themes-grid">
            {THEME_SHOWCASE.map((t) => (
              <article key={t.id} className="lp-theme-card">
                <div
                  className="lp-theme-cover"
                  style={{ backgroundImage: `url(${t.bg})` }}
                >
                  <span className="lp-theme-badge">{t.tag}</span>
                </div>
                <div className="lp-theme-body">
                  <div className="lp-theme-meta">
                    <h3>{t.name}</h3>
                    <div className="lp-theme-palette" aria-label="Color palette">
                      {t.palette.map((c, i) => (
                        <span key={i} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <p className="lp-theme-desc">{t.description}</p>
                  <div className="lp-theme-footer">
                    <span className="lp-theme-fonts">{t.fonts}</span>
                    <button
                      type="button"
                      className="lp-theme-btn"
                      onClick={() => openStudio({ themeId: t.id, mode: 'monthly' })}
                    >
                      Open Theme →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Print & Tablet Hardware Specs */}
        <section id="specs" className="lp-section lp-section-alt">
          <div className="lp-section-head">
            <p className="lp-eyebrow">Engineered For Quality</p>
            <h2>Built for crisp paper &amp; digital tablets</h2>
            <p className="lp-section-sub">
              Designed from the ground up for high-resolution physical printing and paperless GoodNotes planning.
            </p>
          </div>

          <div className="lp-specs-grid">
            {PRINT_SPECS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="lp-spec-card">
                  <div className="lp-spec-top">
                    <div className="lp-spec-icon">
                      <Icon size={22} />
                    </div>
                    <span className="lp-spec-badge">{s.badge}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="lp-section">
          <div className="lp-section-head">
            <p className="lp-eyebrow">How it works</p>
            <h2>Three steps from blank canvas to print shop</h2>
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

        {/* Who it's for */}
        <section className="lp-section lp-section-alt">
          <div className="lp-section-head">
            <p className="lp-eyebrow">Audience</p>
            <h2>Who crafts with PlanCraft?</h2>
          </div>
          <div className="lp-audience-grid">
            {AUDIENCE_CARDS.map((a, idx) => {
              const Icon = a.icon;
              return (
                <article key={idx} className="lp-audience-card">
                  <div className="lp-audience-icon">
                    <Icon size={24} />
                  </div>
                  <span className="lp-audience-tag">{a.tag}</span>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                </article>
              );
            })}
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

          {/* Feature Matrix Table */}
          <div className="lp-matrix-wrap">
            <h3 className="lp-matrix-title">Compare Plans in Detail</h3>
            <div className="lp-matrix-table-container">
              <table className="lp-matrix-table">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th>Studio Free</th>
                    <th className="highlight-col">Pro Lifetime ($9.99)</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={i}>
                      <td>{row.feature}</td>
                      <td>
                        {row.free === true ? (
                          <Check size={16} className="lp-check-yes" />
                        ) : (
                          <Minus size={16} className="lp-check-no" />
                        )}
                      </td>
                      <td className="highlight-col">
                        {typeof row.pro === 'string' ? (
                          <span className="lp-matrix-badge">{row.pro}</span>
                        ) : row.pro === true ? (
                          <Check size={16} className="lp-check-yes" />
                        ) : (
                          <Minus size={16} className="lp-check-no" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
