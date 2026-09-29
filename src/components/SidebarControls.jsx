import React, { useState, useRef, useEffect } from "react";
import {
  Palette,
  Sliders,
  Type,
  Grid,
  Image as ImageIcon,
  Upload,
  Printer,
  RefreshCw,
  Layout,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  FileUp,
  Check,
  Search,
  Sun,
  Droplets,
  Move,
  Plus,
  Trash2,
} from "lucide-react";
import {
  FONT_OPTIONS,
  PRESET_THEMES,
  ONLINE_SUGGESTED_IMAGES,
  PAGE_FORMATS,
} from "../data/presetThemes";
import { MONTH_NAMES } from "../utils/calendarUtils";
import { WEEKLY_LAYOUTS, BOX_INTERIOR_STYLES } from "../utils/weeklyUtils";

export default function SidebarControls({
  plannerMode = "monthly",
  setPlannerMode,
  weeklyLayout = "columns-7",
  setWeeklyLayout,
  weeklyInteriorStyle = "lines",
  setWeeklyInteriorStyle,
  weeklyPriorities = ["", "", ""],
  onPriorityChange,
  habits = ["", "", "", ""],
  onHabitChange,
  referenceDate,
  weekRangeText,
  onPrevWeek,
  onNextWeek,
  year,
  setYear,
  monthIndex,
  setMonthIndex,
  startOfWeek,
  setStartOfWeek,
  customTitle,
  setCustomTitle,
  customYear,
  setCustomYear,
  subtitle,
  setSubtitle,
  bgImage,
  setBgImage,
  styles,
  updateStyles,
  pageFormat,
  setPageFormat,
  onApplyPreset,
  showNotesColumn,
  setShowNotesColumn,
  onReset,
}) {
  const [activeTab, setActiveTab] = useState(
    plannerMode === "weekly" ? "weekly" : "blocks",
  );
  const [onlineCategory, setOnlineCategory] = useState("Halloween & Spooky");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (plannerMode === "monthly" && activeTab === "weekly") {
      setActiveTab("blocks");
    }
  }, [plannerMode, activeTab]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    ...(plannerMode === "weekly"
      ? [{ id: "weekly", label: "Weekly Layout", icon: Layout }]
      : []),
    { id: "blocks", label: "Day Blocks & Color", icon: Grid },
    { id: "typography", label: "Fonts & Titles", icon: Type },
    { id: "image", label: "Background & Theme", icon: ImageIcon },
    {
      id: "calendar",
      label: plannerMode === "weekly" ? "Week Settings" : "Month & Dates",
      icon: CalendarIcon,
    },
    { id: "layout", label: "Page & Margins", icon: Sliders },
  ];

  // Quick preset swatches
  const quickBlockColors = [
    {
      name: "White 75% (Screenshot)",
      fill: "#ffffff",
      opacity: 0.72,
      border: "#e07a14",
    },
    {
      name: "Pure White Solid",
      fill: "#ffffff",
      opacity: 0.95,
      border: "#d97706",
    },
    {
      name: "Warm Cream Parchment",
      fill: "#fffbeb",
      opacity: 0.8,
      border: "#b45309",
    },
    {
      name: "Frosted Glass Ultra",
      fill: "#ffffff",
      opacity: 0.35,
      border: "#ffffff",
    },
    {
      name: "Dark Obsidian Spooky",
      fill: "#111827",
      opacity: 0.75,
      border: "#f97316",
    },
    {
      name: "Soft Sage Botanical",
      fill: "#f0fdf4",
      opacity: 0.82,
      border: "#22c55e",
    },
  ];

  return (
    <aside className="sidebar-container">
      {/* Tab Navigation Strip */}
      <nav className="sidebar-tabs-bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`sidebar-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <Icon size={18} />
              <span className="tab-label-text">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Tab Content Panel */}
      <div className="sidebar-content-panel">
        {/* ------------------------------------------- */}
        {/* TAB 0: WEEKLY LAYOUT & INTERIORS */}
        {/* ------------------------------------------- */}
        {plannerMode === "weekly" && activeTab === "weekly" && (
          <div className="tab-pane animate-fade-in">
            <div className="pane-header">
              <h3>Weekly Layout & Styles</h3>
              <p>Choose your weekly planner framework & day interior designs</p>
            </div>

            {/* Layout Framework Selector */}
            <div className="control-section">
              <label className="section-label">
                Select Weekly Layout Framework
              </label>
              <div className="weekly-layout-cards-grid">
                {WEEKLY_LAYOUTS.map((lay) => (
                  <div
                    key={lay.id}
                    className={`weekly-layout-card ${weeklyLayout === lay.id ? "active" : ""}`}
                    onClick={() => setWeeklyLayout(lay.id)}
                  >
                    <div className="weekly-card-header-line">
                      <strong>{lay.name}</strong>
                      {weeklyLayout === lay.id && (
                        <Check size={14} className="text-orange-500" />
                      )}
                    </div>
                    <span className="card-desc">{lay.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interior Box Style */}
            <div className="control-section">
              <label className="section-label">Interior Day Box Style</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {BOX_INTERIOR_STYLES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    className={`btn-toggle-option ${weeklyInteriorStyle === st.id ? "active" : ""}`}
                    onClick={() => setWeeklyInteriorStyle(st.id)}
                    style={{
                      padding: "8px 10px",
                      fontSize: "11px",
                      textAlign: "center",
                    }}
                  >
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Layout Extra Customizers */}
            {weeklyLayout === "dashboard" && (
              <>
                <div className="control-section">
                  <label className="section-label">
                    Habit Tracker Habits (4 Rows)
                  </label>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      marginBottom: "8px",
                    }}
                  >
                    Configure the 4 daily habits tracked in the weekly matrix:
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {(habits || []).map((habit, hIdx) => (
                      <div
                        key={hIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "var(--text-muted)",
                            width: "20px",
                          }}
                        >
                          #{hIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={habit}
                          onChange={(e) =>
                            onHabitChange && onHabitChange(hIdx, e.target.value)
                          }
                          placeholder={`Habit ${hIdx + 1}`}
                          className="text-input"
                          style={{ fontSize: "12px" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="control-section">
                  <label className="section-label">
                    Top 3 Weekly Priorities
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {(weeklyPriorities || []).map((prio, pIdx) => (
                      <div
                        key={pIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--accent-orange)",
                            width: "20px",
                          }}
                        >
                          P{pIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={prio}
                          onChange={(e) =>
                            onPriorityChange &&
                            onPriorityChange(pIdx, e.target.value)
                          }
                          placeholder={`Top priority ${pIdx + 1}...`}
                          className="text-input"
                          style={{ fontSize: "12px" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Pro Tip Callout */}
            <div className="pro-tip-box" style={{ marginTop: "12px" }}>
              <Printer size={16} className="text-amber-500" />
              <div>
                <strong>300 DPI High-Resolution Output</strong>
                <p>
                  Any selected layout is dynamically scaled for landscape
                  printing on US Letter and A4 with matching festival
                  backgrounds and customizable opacities.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------- */}
        {/* TAB 1: DAY BLOCKS & TRANSPARENCY (User Request Focus) */}
        {/* ------------------------------------------- */}
        {activeTab === "blocks" && (
          <div className="tab-pane animate-fade-in">
            <div className="pane-header">
              <h3>Day Blocks & Transparency</h3>
              <p>Adjust fill opacity, border accents, and cell visibility</p>
            </div>

            {/* Quick Inspiration Palettes */}
            <div className="control-section">
              <label className="section-label">Quick Block Palettes</label>
              <div className="quick-palettes-grid">
                {quickBlockColors.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="palette-preset-chip"
                    onClick={() => {
                      updateStyles({
                        cellBgColor: p.fill,
                        cellOpacity: p.opacity,
                        cellBorderColor: p.border,
                      });
                    }}
                  >
                    <span
                      className="chip-color-preview"
                      style={{
                        backgroundColor: p.fill,
                        borderColor: p.border,
                        borderStyle: "solid",
                        borderWidth: "2px",
                      }}
                    />
                    <span className="chip-name">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cell Fill Color & Opacity */}
            <div className="control-section">
              <label className="section-label">Cell Background Fill</label>

              <div className="color-picker-row">
                <input
                  type="color"
                  value={styles.cellBgColor || "#ffffff"}
                  onChange={(e) =>
                    updateStyles({ cellBgColor: e.target.value })
                  }
                  className="native-color-picker"
                />
                <input
                  type="text"
                  value={styles.cellBgColor || "#ffffff"}
                  onChange={(e) =>
                    updateStyles({ cellBgColor: e.target.value })
                  }
                  className="hex-input"
                />
                <span className="picker-hint">Fill Color</span>
              </div>

              {/* Opacity Slider */}
              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">
                    Fill Opacity (Transparency)
                  </span>
                  <span className="slider-value">
                    {Math.round((styles.cellOpacity ?? 0.72) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={styles.cellOpacity ?? 0.72}
                  onChange={(e) =>
                    updateStyles({ cellOpacity: parseFloat(e.target.value) })
                  }
                  className="modern-slider"
                />
                <div className="slider-hints">
                  <span>0% (Transparent)</span>
                  <span>72% (Screenshot)</span>
                  <span>100% (Solid)</span>
                </div>
              </div>
            </div>

            {/* Cell Border Controls */}
            <div className="control-section">
              <label className="section-label">Cell Border & Grid Lines</label>

              <div className="color-picker-row">
                <input
                  type="color"
                  value={styles.cellBorderColor || "#e07a14"}
                  onChange={(e) =>
                    updateStyles({ cellBorderColor: e.target.value })
                  }
                  className="native-color-picker"
                />
                <input
                  type="text"
                  value={styles.cellBorderColor || "#e07a14"}
                  onChange={(e) =>
                    updateStyles({ cellBorderColor: e.target.value })
                  }
                  className="hex-input"
                />
                <span className="picker-hint">Border Color</span>
              </div>

              {/* Border Thickness */}
              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">Border Width</span>
                  <span className="slider-value">
                    {styles.cellBorderWidth || 1.8}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.2"
                  value={styles.cellBorderWidth ?? 1.8}
                  onChange={(e) =>
                    updateStyles({
                      cellBorderWidth: parseFloat(e.target.value),
                    })
                  }
                  className="modern-slider"
                />
              </div>

              {/* Border Opacity */}
              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">Border Opacity</span>
                  <span className="slider-value">
                    {Math.round((styles.cellBorderOpacity ?? 0.88) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={styles.cellBorderOpacity ?? 0.88}
                  onChange={(e) =>
                    updateStyles({
                      cellBorderOpacity: parseFloat(e.target.value),
                    })
                  }
                  className="modern-slider"
                />
              </div>

              {/* Border Style */}
              <div className="control-row">
                <span className="control-sublabel">Border Style</span>
                <select
                  value={styles.cellBorderStyle || "solid"}
                  onChange={(e) =>
                    updateStyles({ cellBorderStyle: e.target.value })
                  }
                  className="styled-select"
                >
                  <option value="solid">Solid Line</option>
                  <option value="dashed">Dashed Line</option>
                  <option value="dotted">Dotted Line</option>
                  <option value="double">Double Elegant</option>
                </select>
              </div>

              {/* Border Radius */}
              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">Corner Rounding</span>
                  <span className="slider-value">
                    {styles.cellBorderRadius || 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="1"
                  value={styles.cellBorderRadius ?? 0}
                  onChange={(e) =>
                    updateStyles({ cellBorderRadius: parseInt(e.target.value) })
                  }
                  className="modern-slider"
                />
              </div>
            </div>

            {/* Empty Leading/Trailing Day Cells (Only applicable to Monthly Calendar) */}
            {plannerMode === "monthly" && (
              <div className="control-section">
                <label className="section-label">Outer Empty Days Display</label>
                <p className="section-desc">
                  Control days outside the current month (like Sun-Wed before Oct
                  1st)
                </p>

                <div className="button-group-row">
                  <button
                    type="button"
                    className={`btn-toggle-option ${styles.emptyCellMode === "hide" ? "active" : ""}`}
                    onClick={() => updateStyles({ emptyCellMode: "hide" })}
                  >
                    <EyeOff size={14} />
                    <span>Hide (Screenshot)</span>
                  </button>
                  <button
                    type="button"
                    className={`btn-toggle-option ${styles.emptyCellMode === "fade" ? "active" : ""}`}
                    onClick={() => updateStyles({ emptyCellMode: "fade" })}
                  >
                    <Eye size={14} />
                    <span>Faded</span>
                  </button>
                  <button
                    type="button"
                    className={`btn-toggle-option ${styles.emptyCellMode === "show" ? "active" : ""}`}
                    onClick={() => updateStyles({ emptyCellMode: "show" })}
                  >
                    <Grid size={14} />
                    <span>Full Grid</span>
                  </button>
                </div>
              </div>
            )}

            {/* Extra Styling Details */}
            <div className="control-section">
              <label className="section-label">Cell Enhancements</label>

              {plannerMode === "monthly" && (
                <label className="checkbox-toggle-row">
                  <input
                    type="checkbox"
                    checked={styles.showNotesLines || false}
                    onChange={(e) =>
                      updateStyles({ showNotesLines: e.target.checked })
                    }
                  />
                  <span>Show handwriting rule lines inside cells</span>
                </label>
              )}

              <label className="checkbox-toggle-row">
                <input
                  type="checkbox"
                  checked={styles.cellGlassmorphism || false}
                  onChange={(e) =>
                    updateStyles({ cellGlassmorphism: e.target.checked })
                  }
                />
                <span>Frosted Glass (Backdrop blur)</span>
              </label>
            </div>
          </div>
        )}

        {/* ------------------------------------------- */}
        {/* TAB 2: FONTS & TYPOGRAPHY */}
        {/* ------------------------------------------- */}
        {activeTab === "typography" && (
          <div className="tab-pane animate-fade-in">
            <div className="pane-header">
              <h3>Fonts & Typography</h3>
              <p>
                {plannerMode === "weekly"
                  ? "Customize Planner title, Weekday headers, and typography styles"
                  : "Customize Month title, Weekday labels, and Date numbers"}
              </p>
            </div>

            {/* Header Title Typography */}
            <div className="control-section">
              <label className="section-label">
                {plannerMode === "weekly"
                  ? "Planner Header Title Styling"
                  : "Month Title Styling"}
              </label>

              <div className="control-field">
                <span className="control-sublabel">
                  {plannerMode === "weekly" ? "Title Font" : "Month Title Font"}
                </span>
                <select
                  value={styles.titleFont}
                  onChange={(e) => updateStyles({ titleFont: e.target.value })}
                  className="styled-select font-select"
                >
                  {FONT_OPTIONS.map((f, i) => (
                    <option
                      key={i}
                      value={f.value}
                      style={{ fontFamily: f.value }}
                    >
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="color-picker-row">
                <input
                  type="color"
                  value={styles.titleColor || "#1a100a"}
                  onChange={(e) => updateStyles({ titleColor: e.target.value })}
                  className="native-color-picker"
                />
                <input
                  type="text"
                  value={styles.titleColor || "#1a100a"}
                  onChange={(e) => updateStyles({ titleColor: e.target.value })}
                  className="hex-input"
                />
                <span className="picker-hint">Title Color</span>
              </div>

              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">Month Title Size</span>
                  <span className="slider-value">
                    {styles.titleSize || 56}px
                  </span>
                </div>
                <input
                  type="range"
                  min="32"
                  max="90"
                  value={styles.titleSize || 56}
                  onChange={(e) =>
                    updateStyles({ titleSize: parseInt(e.target.value) })
                  }
                  className="modern-slider"
                />
              </div>

              {plannerMode === "monthly" && (
                <div className="control-field">
                  <span className="control-sublabel">
                    Year Font (Complementary)
                  </span>
                  <select
                    value={styles.yearFont || styles.titleFont}
                    onChange={(e) => updateStyles({ yearFont: e.target.value })}
                    className="styled-select"
                  >
                    {FONT_OPTIONS.map((f, i) => (
                      <option key={i} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Title Offset Sliders */}
              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">
                    Title Horizontal Position
                  </span>
                  <span className="slider-value">
                    {styles.titleOffsetX || 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  value={styles.titleOffsetX || 0}
                  onChange={(e) =>
                    updateStyles({ titleOffsetX: parseInt(e.target.value) })
                  }
                  className="modern-slider"
                />
              </div>

              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">Title Vertical Position</span>
                  <span className="slider-value">
                    {styles.titleOffsetY || 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="80"
                  value={styles.titleOffsetY || 0}
                  onChange={(e) =>
                    updateStyles({ titleOffsetY: parseInt(e.target.value) })
                  }
                  className="modern-slider"
                />
              </div>
            </div>

            {/* Weekday Names (Headers) */}
            <div className="control-section">
              <label className="section-label">Weekday Column Headers</label>

              <div className="control-field">
                <span className="control-sublabel">Weekday Font</span>
                <select
                  value={styles.headerFont}
                  onChange={(e) => updateStyles({ headerFont: e.target.value })}
                  className="styled-select"
                >
                  {FONT_OPTIONS.map((f, i) => (
                    <option key={i} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="color-picker-row">
                <input
                  type="color"
                  value={styles.headerColor || "#1c130d"}
                  onChange={(e) =>
                    updateStyles({ headerColor: e.target.value })
                  }
                  className="native-color-picker"
                />
                <input
                  type="text"
                  value={styles.headerColor || "#1c130d"}
                  onChange={(e) =>
                    updateStyles({ headerColor: e.target.value })
                  }
                  className="hex-input"
                />
                <span className="picker-hint">Header Color</span>
              </div>

              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">Header Font Size</span>
                  <span className="slider-value">
                    {styles.headerSize || 13}px
                  </span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="20"
                  value={styles.headerSize || 13}
                  onChange={(e) =>
                    updateStyles({ headerSize: parseInt(e.target.value) })
                  }
                  className="modern-slider"
                />
              </div>

              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">Letter Spacing</span>
                  <span className="slider-value">
                    {styles.headerTracking || 2}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={styles.headerTracking || 2}
                  onChange={(e) =>
                    updateStyles({ headerTracking: parseInt(e.target.value) })
                  }
                  className="modern-slider"
                />
              </div>

              <div className="checkboxes-stack">
                <label className="checkbox-toggle-row">
                  <input
                    type="checkbox"
                    checked={styles.headerUppercase ?? true}
                    onChange={(e) =>
                      updateStyles({ headerUppercase: e.target.checked })
                    }
                  />
                  <span>UPPERCASE (SUNDAY, MONDAY...)</span>
                </label>
                <label className="checkbox-toggle-row">
                  <input
                    type="checkbox"
                    checked={styles.headerShort ?? false}
                    onChange={(e) =>
                      updateStyles({ headerShort: e.target.checked })
                    }
                  />
                  <span>Shortened (SUN, MON...)</span>
                </label>
              </div>

              {/* Weekday Header Background Configuration */}
              <div className="control-field mt-3">
                <span className="control-sublabel">
                  Weekday Background Style
                </span>
                <div className="button-group-row">
                  {[
                    { id: "none", label: "Transparent" },
                    { id: "banner", label: "Continuous Bar" },
                    { id: "pill", label: "Capsule Pills" },
                    { id: "underline", label: "Underline" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      className={`btn-toggle-option ${(styles.headerBgMode || "none") === mode.id ? "active" : ""}`}
                      onClick={() => updateStyles({ headerBgMode: mode.id })}
                    >
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls when a background mode is active */}
              {styles.headerBgMode && styles.headerBgMode !== "none" && (
                <div className="sub-settings-panel">
                  {/* Quick match day blocks button */}
                  <button
                    type="button"
                    className="btn-quick-sync-match"
                    onClick={() => {
                      updateStyles({
                        headerBgColor: styles.cellBgColor || "#ffffff",
                        headerBgOpacity: styles.cellOpacity ?? 0.8,
                        headerBorderColor: styles.cellBorderColor || "#e07a14",
                        headerBorderWidth: styles.cellBorderWidth || 1.5,
                        headerBorderOpacity: styles.cellBorderOpacity || 0.85,
                        headerBorderRadius:
                          styles.headerBgMode === "pill"
                            ? 16
                            : styles.cellBorderRadius || 4,
                      });
                    }}
                  >
                    <span>✨ Match Day Blocks Fill & Border</span>
                  </button>

                  {/* Header Background Color */}
                  <div className="color-picker-row mt-2">
                    <input
                      type="color"
                      value={
                        styles.headerBgColor || styles.cellBgColor || "#ffffff"
                      }
                      onChange={(e) =>
                        updateStyles({ headerBgColor: e.target.value })
                      }
                      className="native-color-picker"
                    />
                    <input
                      type="text"
                      value={
                        styles.headerBgColor || styles.cellBgColor || "#ffffff"
                      }
                      onChange={(e) =>
                        updateStyles({ headerBgColor: e.target.value })
                      }
                      className="hex-input"
                    />
                    <span className="picker-hint">Weekday Fill Color</span>
                  </div>

                  {/* Header Opacity Slider */}
                  <div className="slider-control-group">
                    <div className="slider-header">
                      <span className="slider-label">Weekday Fill Opacity</span>
                      <span className="slider-value">
                        {Math.round((styles.headerBgOpacity ?? 0.82) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={styles.headerBgOpacity ?? 0.82}
                      onChange={(e) =>
                        updateStyles({
                          headerBgOpacity: parseFloat(e.target.value),
                        })
                      }
                      className="modern-slider"
                    />
                  </div>

                  {/* Header Border Color */}
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={
                        styles.headerBorderColor ||
                        styles.cellBorderColor ||
                        "#e07a14"
                      }
                      onChange={(e) =>
                        updateStyles({ headerBorderColor: e.target.value })
                      }
                      className="native-color-picker"
                    />
                    <input
                      type="text"
                      value={
                        styles.headerBorderColor ||
                        styles.cellBorderColor ||
                        "#e07a14"
                      }
                      onChange={(e) =>
                        updateStyles({ headerBorderColor: e.target.value })
                      }
                      className="hex-input"
                    />
                    <span className="picker-hint">Weekday Border Color</span>
                  </div>

                  {/* Border Width & Radius */}
                  <div className="slider-control-group">
                    <div className="slider-header">
                      <span className="slider-label">Border Width</span>
                      <span className="slider-value">
                        {styles.headerBorderWidth ?? 1.2}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="0.2"
                      value={styles.headerBorderWidth ?? 1.2}
                      onChange={(e) =>
                        updateStyles({
                          headerBorderWidth: parseFloat(e.target.value),
                        })
                      }
                      className="modern-slider"
                    />
                  </div>

                  <div className="slider-control-group">
                    <div className="slider-header">
                      <span className="slider-label">Corner Rounding</span>
                      <span className="slider-value">
                        {styles.headerBorderRadius !== undefined
                          ? styles.headerBorderRadius
                          : styles.headerBgMode === "pill"
                            ? 16
                            : 4}
                        px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="1"
                      value={
                        styles.headerBorderRadius !== undefined
                          ? styles.headerBorderRadius
                          : styles.headerBgMode === "pill"
                            ? 16
                            : 4
                      }
                      onChange={(e) =>
                        updateStyles({
                          headerBorderRadius: parseInt(e.target.value),
                        })
                      }
                      className="modern-slider"
                    />
                  </div>

                  {/* Vertical Padding */}
                  <div className="slider-control-group">
                    <div className="slider-header">
                      <span className="slider-label">Vertical Padding</span>
                      <span className="slider-value">
                        {styles.headerPaddingY ?? 5}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="14"
                      step="1"
                      value={styles.headerPaddingY ?? 5}
                      onChange={(e) =>
                        updateStyles({
                          headerPaddingY: parseInt(e.target.value),
                        })
                      }
                      className="modern-slider"
                    />
                  </div>

                  <div className="checkboxes-stack mt-2">
                    <label className="checkbox-toggle-row">
                      <input
                        type="checkbox"
                        checked={styles.headerGlassmorphism || false}
                        onChange={(e) =>
                          updateStyles({
                            headerGlassmorphism: e.target.checked,
                          })
                        }
                      />
                      <span>Frosted Glass Blur</span>
                    </label>
                    <label className="checkbox-toggle-row">
                      <input
                        type="checkbox"
                        checked={styles.headerShadow || false}
                        onChange={(e) =>
                          updateStyles({ headerShadow: e.target.checked })
                        }
                      />
                      <span>Subtle Drop Shadow</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Contrast Shadow Checkbox for text readability */}
              <div className="mt-2">
                <label className="checkbox-toggle-row">
                  <input
                    type="checkbox"
                    checked={styles.headerContrastShadow || false}
                    onChange={(e) =>
                      updateStyles({ headerContrastShadow: e.target.checked })
                    }
                  />
                  <span>
                    Text Contrast Shadow (Enhances readability over busy
                    backgrounds)
                  </span>
                </label>
              </div>
            </div>

            {/* Date Numbers (Monthly Calendar Only) */}
            {plannerMode === "monthly" && (
              <div className="control-section">
                <label className="section-label">Date Numbers</label>

                <div className="control-field">
                  <span className="control-sublabel">Date Font</span>
                  <select
                    value={styles.dateFont}
                    onChange={(e) => updateStyles({ dateFont: e.target.value })}
                    className="styled-select"
                  >
                    {FONT_OPTIONS.map((f, i) => (
                      <option key={i} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="color-picker-row">
                  <input
                    type="color"
                    value={styles.dateColor || "#251910"}
                    onChange={(e) => updateStyles({ dateColor: e.target.value })}
                    className="native-color-picker"
                  />
                  <input
                    type="text"
                    value={styles.dateColor || "#251910"}
                    onChange={(e) => updateStyles({ dateColor: e.target.value })}
                    className="hex-input"
                  />
                  <span className="picker-hint">Date Color</span>
                </div>

                <div className="control-field">
                  <span className="control-sublabel">Number Placement</span>
                  <div className="button-group-row">
                    {["top-right", "top-left", "center"].map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        className={`btn-toggle-option ${styles.datePosition === pos ? "active" : ""}`}
                        onClick={() => updateStyles({ datePosition: pos })}
                      >
                        <span>{pos.replace("-", " ").toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="slider-control-group">
                  <div className="slider-header">
                    <span className="slider-label">Date Number Size</span>
                    <span className="slider-value">
                      {styles.dateSize || 14}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={styles.dateSize || 14}
                    onChange={(e) =>
                      updateStyles({ dateSize: parseInt(e.target.value) })
                    }
                    className="modern-slider"
                  />
                </div>

                <label className="checkbox-toggle-row">
                  <input
                    type="checkbox"
                    checked={styles.highlightWeekends || false}
                    onChange={(e) =>
                      updateStyles({ highlightWeekends: e.target.checked })
                    }
                  />
                  <span>Highlight Weekend Dates</span>
                </label>

                {styles.highlightWeekends && (
                  <div className="color-picker-row mt-2">
                    <input
                      type="color"
                      value={styles.weekendColor || "#e11d48"}
                      onChange={(e) =>
                        updateStyles({ weekendColor: e.target.value })
                      }
                      className="native-color-picker"
                    />
                    <span className="picker-hint">Weekend Highlight Color</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------- */}
        {/* TAB 3: BACKGROUND & THEME */}
        {/* ------------------------------------------- */}
        {activeTab === "image" && (
          <div className="tab-pane animate-fade-in">
            <div className="pane-header">
              <h3>Background & Theme</h3>
              <p>
                Upload your own graphic or pick from high-definition online
                artwork
              </p>
            </div>

            {/* Custom File Upload */}
            <div className="control-section upload-hero-section">
              <label className="section-label">Upload Any Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <div
                className="drop-zone-card"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={24} className="text-orange-500" />
                <strong>Click to browse or drop an image</strong>
                <span className="subtext">
                  Supports PNG, JPG, WebP, SVG (Ultra-HD recommended)
                </span>
              </div>
            </div>

            {/* Preset Themes Gallery */}
            <div className="control-section">
              <label className="section-label">Curated Aesthetic Themes</label>
              <div className="preset-themes-list">
                {PRESET_THEMES.map((theme) => {
                  const isCurrent = bgImage === theme.bgImage;
                  return (
                    <div
                      key={theme.id}
                      className={`theme-preset-card ${isCurrent ? "active" : ""}`}
                      onClick={() => onApplyPreset(theme)}
                    >
                      <div
                        className="preset-card-thumb"
                        style={{ backgroundImage: `url(${theme.bgImage})` }}
                      />
                      <div className="preset-card-info">
                        <strong>{theme.name}</strong>
                        <span>{theme.category} Palette</span>
                      </div>
                      {isCurrent && (
                        <Check size={16} className="text-orange-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Online Suggested High Quality Images */}
            <div className="control-section">
              <label className="section-label">
                Online High-Res Suggested Art
              </label>

              {/* Category Pills */}
              <div className="category-chips-scroll">
                {ONLINE_SUGGESTED_IMAGES.map((group) => (
                  <button
                    key={group.category}
                    type="button"
                    className={`category-chip ${onlineCategory === group.category ? "active" : ""}`}
                    onClick={() => setOnlineCategory(group.category)}
                  >
                    {group.category}
                  </button>
                ))}
              </div>

              {/* Images Grid */}
              <div className="suggested-images-grid">
                {ONLINE_SUGGESTED_IMAGES.find(
                  (g) => g.category === onlineCategory,
                )?.images.map((img) => (
                  <div
                    key={img.id}
                    className={`suggested-image-card ${bgImage === img.url ? "active" : ""}`}
                    onClick={() => setBgImage(img.url)}
                    title={img.title}
                  >
                    <img src={img.thumb} alt={img.title} loading="lazy" />
                    <span className="img-title-hover">{img.title}</span>
                    {bgImage === img.url && (
                      <div className="applied-badge">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Background Image Adjustments */}
            <div className="control-section">
              <label className="section-label">Image Color & Lighting</label>

              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">Brightness</span>
                  <span className="slider-value">
                    {styles.bgFilterBrightness || 100}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={styles.bgFilterBrightness || 100}
                  onChange={(e) =>
                    updateStyles({
                      bgFilterBrightness: parseInt(e.target.value),
                    })
                  }
                  className="modern-slider"
                />
              </div>

              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">Contrast</span>
                  <span className="slider-value">
                    {styles.bgFilterContrast || 100}%
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  value={styles.bgFilterContrast || 100}
                  onChange={(e) =>
                    updateStyles({ bgFilterContrast: parseInt(e.target.value) })
                  }
                  className="modern-slider"
                />
              </div>

              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">Warmth / Vintage Tint</span>
                  <span className="slider-value">
                    {styles.bgFilterWarmth || 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={styles.bgFilterWarmth || 0}
                  onChange={(e) =>
                    updateStyles({ bgFilterWarmth: parseInt(e.target.value) })
                  }
                  className="modern-slider"
                />
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------- */}
        {/* TAB 4: MONTH & DATES / WEEK SETTINGS */}
        {/* ------------------------------------------- */}
        {activeTab === "calendar" && (
          <div className="tab-pane animate-fade-in">
            <div className="pane-header">
              <h3>
                {plannerMode === "weekly"
                  ? "Week Settings & Titles"
                  : "Month & Dates Setup"}
              </h3>
              <p>
                {plannerMode === "weekly"
                  ? "Configure undated weekday ordering and custom planner titles"
                  : "Select calendar date, week start, and custom text titles"}
              </p>
            </div>

            {/* In Monthly mode: show Month & Year selection */}
            {plannerMode === "monthly" && (
              <div className="control-section">
                <label className="section-label">Calendar Date</label>

                <div className="date-pickers-split">
                  <div className="field-group">
                    <span className="control-sublabel">Month</span>
                    <select
                      value={monthIndex}
                      onChange={(e) => {
                        const newMonth = parseInt(e.target.value);
                        setMonthIndex(newMonth);
                        setCustomTitle(MONTH_NAMES[newMonth]);
                      }}
                      className="styled-select"
                    >
                      {MONTH_NAMES.map((m, idx) => (
                        <option key={idx} value={idx}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <span className="control-sublabel">Year</span>
                    <input
                      type="number"
                      min="2020"
                      max="2040"
                      value={year}
                      onChange={(e) => {
                        const newYear = parseInt(e.target.value);
                        setYear(newYear);
                        setCustomYear(String(newYear));
                      }}
                      className="styled-number-input"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="control-section">
              <label className="section-label">Week Starts On</label>
              <div className="button-group-row">
                <button
                  type="button"
                  className={`btn-toggle-option ${startOfWeek === 1 ? "active" : ""}`}
                  onClick={() => setStartOfWeek(1)}
                >
                  <span>Monday First</span>
                </button>
                <button
                  type="button"
                  className={`btn-toggle-option ${startOfWeek === 0 ? "active" : ""}`}
                  onClick={() => setStartOfWeek(0)}
                >
                  <span>Sunday First</span>
                </button>
              </div>
            </div>

            <div className="control-section">
              <label className="section-label">Editable Titles</label>

              <div className="control-field">
                <span className="control-sublabel">
                  {plannerMode === "weekly"
                    ? "Planner Header Title"
                    : "Header Month Text"}
                </span>
                <input
                  type="text"
                  value={customTitle}
                  placeholder={
                    plannerMode === "weekly"
                      ? "e.g. Weekly Planner"
                      : "e.g. October"
                  }
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="text-input"
                />
              </div>

              {plannerMode === "monthly" && (
                <div className="control-field">
                  <span className="control-sublabel">Header Year Text</span>
                  <input
                    type="text"
                    value={customYear}
                    placeholder="e.g. 2026"
                    onChange={(e) => setCustomYear(e.target.value)}
                    className="text-input"
                  />
                </div>
              )}

              <div className="control-field">
                <span className="control-sublabel">
                  Subtitle / Motto (Optional)
                </span>
                <input
                  type="text"
                  value={subtitle}
                  placeholder="e.g. Priorities, Focus & Routine"
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------- */}
        {/* TAB 5: PAGE & LAYOUT */}
        {/* ------------------------------------------- */}
        {activeTab === "layout" && (
          <div className="tab-pane animate-fade-in">
            <div className="pane-header">
              <h3>Page & Layout</h3>
              <p>Configure paper dimensions and calendar grid positioning</p>
            </div>

            <div className="control-section">
              <label className="section-label">Paper / Display Format</label>
              <div className="format-options-list">
                {PAGE_FORMATS.map((fmt) => (
                  <div
                    key={fmt.id}
                    className={`format-option-card ${pageFormat.id === fmt.id ? "active" : ""}`}
                    onClick={() => setPageFormat(fmt)}
                  >
                    <div>
                      <strong>{fmt.name}</strong>
                      <span className="subtext">
                        {fmt.widthMm} × {fmt.heightMm} mm
                      </span>
                    </div>
                    {pageFormat.id === fmt.id && (
                      <Check size={16} className="text-orange-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="control-section">
              <label className="section-label">Grid Spacing & Margins</label>

              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">
                    Top Offset (Artwork Clearance)
                  </span>
                  <span className="slider-value">{styles.gridTopOffset}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={styles.gridTopOffset}
                  onChange={(e) =>
                    updateStyles({ gridTopOffset: parseInt(e.target.value) })
                  }
                  className="modern-slider"
                />
              </div>

              <div className="slider-control-group">
                <div className="slider-header">
                  <span className="slider-label">Grid Width</span>
                  <span className="slider-value">
                    {styles.gridWidthPercent || 88}%
                  </span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="96"
                  value={styles.gridWidthPercent || 88}
                  onChange={(e) =>
                    updateStyles({ gridWidthPercent: parseInt(e.target.value) })
                  }
                  className="modern-slider"
                />
              </div>
            </div>

            {plannerMode === "monthly" && (
              <div className="control-section">
                <label className="section-label">Additional Columns</label>
                <label className="checkbox-toggle-row">
                  <input
                    type="checkbox"
                    checked={showNotesColumn}
                    onChange={(e) => setShowNotesColumn(e.target.checked)}
                  />
                  <span>Add "Monthly Goals & Priorities" Sidebar</span>
                </label>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
