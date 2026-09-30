import React, { useState, useRef, useEffect, useCallback } from 'react';
import Toolbar from './components/Toolbar';
import SidebarControls from './components/SidebarControls';
import CalendarCanvas from './components/CalendarCanvas';
import WeeklyCanvas from './components/WeeklyCanvas';
import CellEditorModal from './components/CellEditorModal';
import ExportModal from './components/ExportModal';
import ComplianceModal from './components/ComplianceModal';
import FooterCompliance from './components/FooterCompliance';
import { PRESET_THEMES, PAGE_FORMATS } from './data/presetThemes';
import { MONTH_NAMES, DEFAULT_HOLIDAYS } from './utils/calendarUtils';
import { getSavedLicense } from './utils/gumroadService';
import './App.css';

const AUTOSAVE_KEY = 'plancraft_autosave_v1';
const MAX_BG_DATA_URL_CHARS = 1.5 * 1024 * 1024; // ~1.5MB — skip huge uploads

function loadAutosave() {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Autosave restore failed:', err);
    return null;
  }
}

function sanitizeBgForSave(bgImage) {
  if (!bgImage || typeof bgImage !== 'string') return bgImage || '';
  if (bgImage.startsWith('data:') && bgImage.length > MAX_BG_DATA_URL_CHARS) {
    return ''; // skip oversized data URLs
  }
  return bgImage;
}

export default function App({
  onGoHome,
  initialThemeId,
  initialMode,
  initialLayout,
} = {}) {
  const canvasRef = useRef(null);
  const autosaveReady = useRef(false);
  const savedDraft = useRef(null);
  if (savedDraft.current === null) {
    savedDraft.current = loadAutosave();
  }
  const draft = savedDraft.current;

  // Pro License State (sync with localStorage)
  const [proLicense, setProLicense] = useState(getSavedLicense());

  // Check if a specific theme was requested via URL/Landing Page click
  const requestedTheme = initialThemeId
    ? PRESET_THEMES.find((t) => t.id === initialThemeId)
    : null;

  // Default theme fallback
  const initialTheme = requestedTheme || PRESET_THEMES[0];

  // Mode: 'monthly' | 'weekly'
  const [plannerMode, setPlannerMode] = useState(
    initialMode || (requestedTheme ? 'monthly' : draft?.plannerMode || 'monthly'),
  );

  // Monthly Planner state
  const [year, setYear] = useState(
    requestedTheme?.defaultYear ?? draft?.year ?? 2026,
  );
  const [monthIndex, setMonthIndex] = useState(
    requestedTheme?.defaultMonth ?? draft?.monthIndex ?? 9,
  );
  const [startOfWeek, setStartOfWeek] = useState(draft?.startOfWeek ?? 1); // 1 = Monday, 0 = Sunday
  const [customTitle, setCustomTitle] = useState(
    requestedTheme
      ? (requestedTheme.defaultMonth !== undefined ? MONTH_NAMES[requestedTheme.defaultMonth] : 'October')
      : draft?.customTitle ?? MONTH_NAMES[draft?.monthIndex ?? 9] ?? 'October',
  );
  const [customYear, setCustomYear] = useState(
    requestedTheme
      ? String(requestedTheme.defaultYear ?? 2026)
      : draft?.customYear ?? '2026',
  );
  const [subtitle, setSubtitle] = useState(requestedTheme ? '' : draft?.subtitle ?? '');
  const [bgImage, setBgImage] = useState(
    requestedTheme ? requestedTheme.bgImage : draft?.bgImage ?? initialTheme.bgImage,
  );
  const [pageFormat, setPageFormat] = useState(draft?.pageFormat || PAGE_FORMATS[0]); // US Letter Landscape
  const [styles, setStyles] = useState(
    requestedTheme
      ? { titleOffsetX: 0, titleOffsetY: 0, ...requestedTheme.styles }
      : draft?.styles || initialTheme.styles,
  );

  // Weekly Planner state (100% Undated - Weekdays only)
  const [weeklyTitle, setWeeklyTitle] = useState(draft?.weeklyTitle || 'Weekly Planner');
  const [weeklySubtitle, setWeeklySubtitle] = useState(draft?.weeklySubtitle || '');
  const [weeklyLayout, setWeeklyLayout] = useState(
    initialLayout || draft?.weeklyLayout || 'columns-7',
  ); // 'columns-7' | 'grid-8' | 'horizontal' | 'dashboard'
  const [weeklyInteriorStyle, setWeeklyInteriorStyle] = useState(
    draft?.weeklyInteriorStyle || 'lines',
  ); // 'lines' | 'checkboxes' | 'schedule' | 'blank'
  const [weeklyPriorities, setWeeklyPriorities] = useState(
    draft?.weeklyPriorities || [
      'Top project deliverable',
      'Self-care & workout routine',
      'Weekly review & organization',
    ],
  );
  const [habits, setHabits] = useState(
    draft?.habits || [
      'Hydration (2L)',
      'Workout / Walk',
      'Read 20 Mins',
      'Sleep 8 Hours',
    ],
  );
  const [weeklyNotes, setWeeklyNotes] = useState(
    draft?.weeklyNotes ?? '- Important follow-ups\n- Meal plan ideas\n- Weekend errands',
  );
  
  // Custom events & stickers per dateKey / weekdayKey (e.g. '2026-10-31' or 'weekly-mon')
  const [events, setEvents] = useState(
    draft?.events || {
      '2026-10-31': { title: '🎃 Halloween', color: '#ea580c', textColor: '#ffffff' },
      'weekly-fri': { title: '🎉 TGIF Review', color: '#ea580c', textColor: '#ffffff' },
    },
  );
  const [stickers, setStickers] = useState(
    draft?.stickers || {
      '2026-10-31': '👻',
      'weekly-fri': '✨',
    },
  );

  // Notes column for monthly
  const [showNotesColumn, setShowNotesColumn] = useState(draft?.showNotesColumn ?? false);
  const [notesList, setNotesList] = useState(
    draft?.notesList || [
      'Decorate house for Halloween',
      'Order cute treat bags',
      'Finish autumn project milestones',
      'Pumpkin carving night',
    ],
  );

  // UI Modals & Zoom
  const [zoom, setZoom] = useState(1);
  const [activeCellModal, setActiveCellModal] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [complianceInitialTab, setComplianceInitialTab] = useState('plans');
  const [draftSavedAt, setDraftSavedAt] = useState(
    draft?.savedAt ? new Date(draft.savedAt) : null,
  );

  useEffect(() => {
    // Skip the first paint so we don't overwrite a just-restored draft with defaults
    const t = setTimeout(() => {
      autosaveReady.current = true;
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const handleOpenCompliance = (tab = 'plans') => {
    setComplianceInitialTab(tab);
    setIsComplianceOpen(true);
  };

  // Helper to update styles
  const updateStyles = (newStyles) => {
    setStyles(prev => ({ ...prev, ...newStyles }));
  };

  // Apply a preset theme
  const handleApplyPreset = (theme) => {
    setBgImage(theme.bgImage);
    // Explicitly reset position offsets if the theme doesn't define them,
    // so previous JSON imported offsets don't displace or hide the new template's title!
    const cleanStyles = {
      titleOffsetX: 0,
      titleOffsetY: 0,
      ...theme.styles,
    };
    setStyles(cleanStyles);
    if (theme.defaultMonth !== undefined) {
      setMonthIndex(theme.defaultMonth);
      setCustomTitle(MONTH_NAMES[theme.defaultMonth]);
    }
    if (theme.defaultYear !== undefined) {
      setYear(theme.defaultYear);
      setCustomYear(String(theme.defaultYear));
    }
  };

  // Reset to initial
  const handleReset = () => {
    handleApplyPreset(initialTheme);
    setStartOfWeek(1);
    setShowNotesColumn(false);
    setWeeklyLayout('columns-7');
    setWeeklyInteriorStyle('lines');
    setWeeklyTitle('Weekly Planner');
    setWeeklySubtitle('');
    setZoom(1);
  };

  // Weekly Dashboard inputs
  const handlePriorityChange = (idx, val) => {
    setWeeklyPriorities(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const handleHabitChange = (idx, val) => {
    setHabits(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  // Handle loading design template from JSON
  const handleLoadTemplate = (config) => {
    if (!config) return;
    try {
      if (config.plannerMode) setPlannerMode(config.plannerMode);
      if (config.year !== undefined) setYear(config.year);
      if (config.monthIndex !== undefined) setMonthIndex(config.monthIndex);
      if (config.startOfWeek !== undefined) setStartOfWeek(config.startOfWeek);
      if (config.customTitle !== undefined) {
        if (config.plannerMode === 'weekly') setWeeklyTitle(config.customTitle);
        else setCustomTitle(config.customTitle);
      }
      if (config.customYear !== undefined) setCustomYear(config.customYear);
      if (config.subtitle !== undefined) {
        if (config.plannerMode === 'weekly') setWeeklySubtitle(config.subtitle);
        else setSubtitle(config.subtitle);
      }
      if (config.bgImage !== undefined) setBgImage(config.bgImage);
      if (config.pageFormat) setPageFormat(config.pageFormat);
      if (config.styles) setStyles(config.styles);
      if (config.events) setEvents(config.events);
      if (config.stickers) setStickers(config.stickers);
      if (config.showNotesColumn !== undefined) setShowNotesColumn(config.showNotesColumn);
      if (config.notesList) setNotesList(config.notesList);
      if (config.weeklyLayout) setWeeklyLayout(config.weeklyLayout);
      if (config.weeklyInteriorStyle) setWeeklyInteriorStyle(config.weeklyInteriorStyle);
      if (config.weeklyPriorities) setWeeklyPriorities(config.weeklyPriorities);
      if (config.habits) setHabits(config.habits);
      if (config.weeklyNotes !== undefined) setWeeklyNotes(config.weeklyNotes);
    } catch (err) {
      console.error('Error loading template config:', err);
    }
  };

  // Handle cell click (both monthly & weekly)
  const handleCellClick = (cell) => {
    setActiveCellModal(cell);
  };

  // Save event / sticker for cell
  const handleSaveCellData = ({ dateKey, event, sticker }) => {
    if (event) {
      setEvents(prev => ({ ...prev, [dateKey]: event }));
    } else {
      setEvents(prev => {
        const next = { ...prev };
        delete next[dateKey];
        return next;
      });
    }

    if (sticker) {
      setStickers(prev => ({ ...prev, [dateKey]: sticker }));
    } else {
      setStickers(prev => {
        const next = { ...prev };
        delete next[dateKey];
        return next;
      });
    }
  };

  // Delete event & sticker for cell
  const handleDeleteCellData = (dateKey) => {
    setEvents(prev => {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
    setStickers(prev => {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
  };

  const handleNotesChange = (idx, val) => {
    setNotesList(prev => {
      const updated = [...prev];
      updated[idx] = val;
      return updated;
    });
  };

  // Full config object for JSON export
  const fullConfig = {
    version: '2.0',
    plannerMode,
    year: plannerMode === 'weekly' ? undefined : year,
    monthIndex: plannerMode === 'weekly' ? undefined : monthIndex,
    startOfWeek,
    customTitle: plannerMode === 'weekly' ? weeklyTitle : customTitle,
    customYear: plannerMode === 'weekly' ? undefined : customYear,
    subtitle: plannerMode === 'weekly' ? weeklySubtitle : subtitle,
    bgImage,
    pageFormat,
    styles,
    events,
    stickers,
    showNotesColumn,
    notesList,
    weeklyLayout,
    weeklyInteriorStyle,
    weeklyPriorities,
    habits,
    weeklyNotes
  };


  const persistAutosave = useCallback(() => {
    if (!autosaveReady.current) return;
    try {
      const payload = {
        version: 1,
        savedAt: new Date().toISOString(),
        plannerMode,
        year,
        monthIndex,
        startOfWeek,
        customTitle,
        customYear,
        subtitle,
        bgImage: sanitizeBgForSave(bgImage),
        pageFormat,
        styles,
        events,
        stickers,
        showNotesColumn,
        notesList,
        weeklyLayout,
        weeklyInteriorStyle,
        weeklyPriorities,
        habits,
        weeklyNotes,
        weeklyTitle,
        weeklySubtitle,
      };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
      setDraftSavedAt(new Date());
    } catch (err) {
      console.warn('Autosave failed:', err);
    }
  }, [
    plannerMode,
    year,
    monthIndex,
    startOfWeek,
    customTitle,
    customYear,
    subtitle,
    bgImage,
    pageFormat,
    styles,
    events,
    stickers,
    showNotesColumn,
    notesList,
    weeklyLayout,
    weeklyInteriorStyle,
    weeklyPriorities,
    habits,
    weeklyNotes,
    weeklyTitle,
    weeklySubtitle,
  ]);

  useEffect(() => {
    const timer = setTimeout(persistAutosave, 600);
    return () => clearTimeout(timer);
  }, [persistAutosave]);

  return (
    <div className="app-container">
      {/* Top Studio Toolbar */}
      <Toolbar
        isPro={!!proLicense}
        plannerMode={plannerMode}
        setPlannerMode={setPlannerMode}
        year={year}
        setYear={setYear}
        monthIndex={monthIndex}
        setMonthIndex={(m) => {
          setMonthIndex(m);
          setCustomTitle(MONTH_NAMES[m]);
        }}
        zoom={zoom}
        setZoom={setZoom}
        onReset={handleReset}
        onOpenExport={() => setIsExportModalOpen(true)}
        onApplyPreset={handleApplyPreset}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onOpenCompliance={handleOpenCompliance}
        onLoadTemplate={handleLoadTemplate}
        draftSavedAt={draftSavedAt}
        onGoHome={onGoHome}
      />

      {/* Main Studio Workspace: Sidebar Controls + Live Canvas Artboard */}
      <main className="studio-main-workspace">
        <SidebarControls
          plannerMode={plannerMode}
          setPlannerMode={setPlannerMode}
          weeklyLayout={weeklyLayout}
          setWeeklyLayout={setWeeklyLayout}
          weeklyInteriorStyle={weeklyInteriorStyle}
          setWeeklyInteriorStyle={setWeeklyInteriorStyle}
          weeklyPriorities={weeklyPriorities}
          onPriorityChange={handlePriorityChange}
          habits={habits}
          onHabitChange={handleHabitChange}
          year={year}
          setYear={setYear}
          monthIndex={monthIndex}
          setMonthIndex={setMonthIndex}
          startOfWeek={startOfWeek}
          setStartOfWeek={setStartOfWeek}
          customTitle={plannerMode === 'weekly' ? weeklyTitle : customTitle}
          setCustomTitle={plannerMode === 'weekly' ? setWeeklyTitle : setCustomTitle}
          customYear={customYear}
          setCustomYear={setCustomYear}
          subtitle={plannerMode === 'weekly' ? weeklySubtitle : subtitle}
          setSubtitle={plannerMode === 'weekly' ? setWeeklySubtitle : setSubtitle}
          bgImage={bgImage}
          setBgImage={setBgImage}
          styles={styles}
          updateStyles={updateStyles}
          pageFormat={pageFormat}
          setPageFormat={setPageFormat}
          onApplyPreset={handleApplyPreset}
          showNotesColumn={showNotesColumn}
          setShowNotesColumn={setShowNotesColumn}
          onReset={handleReset}
        />

        {/* Central Canvas Board Stage */}
        <section className="canvas-stage-area">
          <div className="stage-canvas-scroll-container">
            {plannerMode === 'monthly' ? (
              <CalendarCanvas
                ref={canvasRef}
                year={year}
                monthIndex={monthIndex}
                monthName={MONTH_NAMES[monthIndex]}
                startOfWeek={startOfWeek}
                customTitle={customTitle}
                customYear={customYear}
                subtitle={subtitle}
                bgImage={bgImage}
                pageFormat={pageFormat}
                styles={styles}
                events={events}
                stickers={stickers}
                onCellClick={handleCellClick}
                zoom={zoom}
                showNotesColumn={showNotesColumn}
                notesList={notesList}
                onNotesChange={handleNotesChange}
              />
            ) : (
              <WeeklyCanvas
                ref={canvasRef}
                startOfWeek={startOfWeek}
                customTitle={weeklyTitle}
                customSubtitle={weeklySubtitle}
                bgImage={bgImage}
                pageFormat={pageFormat}
                styles={styles}
                weeklyLayout={weeklyLayout}
                weeklyInteriorStyle={weeklyInteriorStyle}
                events={events}
                stickers={stickers}
                onCellClick={handleCellClick}
                zoom={zoom}
                weeklyPriorities={weeklyPriorities}
                onPriorityChange={handlePriorityChange}
                habits={habits}
                onHabitChange={handleHabitChange}
                weeklyNotes={weeklyNotes}
                onWeeklyNotesChange={setWeeklyNotes}
              />
            )}
          </div>

          {/* Interactive Hint Pill */}
          <div className="canvas-quick-hint-pill">
            💡 <span>
              {plannerMode === 'monthly' 
                ? 'Tip: Click on any day cell to add an event note, badge color, or sticker!'
                : 'Tip: Undated weekly planner! Click any day column to add badges or stickers, and customize layout in the sidebar.'}
            </span>
          </div>
        </section>
      </main>

      {/* Compliance & Legal Footer (Razorpay Verification Requirement) */}
      <FooterCompliance onOpenCompliance={handleOpenCompliance} />

      {/* Cell Detail / Event Modal */}
      {activeCellModal && (
        <CellEditorModal
          isOpen={!!activeCellModal}
          cell={activeCellModal}
          monthName={activeCellModal.dayName || activeCellModal.monthName || MONTH_NAMES[monthIndex]}
          year={plannerMode === 'weekly' ? '' : (activeCellModal.year || year)}
          currentEvent={events[activeCellModal.dateKey]}
          currentSticker={stickers[activeCellModal.dateKey]}
          onSave={handleSaveCellData}
          onDelete={handleDeleteCellData}
          onClose={() => setActiveCellModal(null)}
        />
      )}

      {/* Multi-Format Export Modal (PDF / PNG / JPEG / JSON / Clipboard) */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        canvasRef={canvasRef}
        monthName={plannerMode === 'weekly' ? (weeklyTitle || 'Weekly-Planner') : (customTitle || MONTH_NAMES[monthIndex])}
        year={plannerMode === 'weekly' ? 'Undated' : (customYear || year)}
        pageFormat={pageFormat}
        fullConfig={fullConfig}
        proLicense={proLicense}
        onLicenseChange={(lic) => setProLicense(lic)}
      />

      {/* Razorpay Compliance Modal (Plans, About, Contact, Terms, Privacy, Refund, Shipping) */}
      <ComplianceModal
        isOpen={isComplianceOpen}
        onClose={() => setIsComplianceOpen(false)}
        initialTab={complianceInitialTab}
      />
    </div>
  );
}
