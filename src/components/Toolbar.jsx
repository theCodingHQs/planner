import React, { useRef } from "react";
import {
  CalendarDays,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Layers,
  Printer,
  HelpCircle,
  Palette,
  Tag,
  Upload,
  Cloud,
  Home,
} from "lucide-react";
import { MONTH_NAMES } from "../utils/calendarUtils";
import { PRESET_THEMES } from "../data/presetThemes";

export default function Toolbar({
  isPro = false,
  plannerMode = "monthly",
  setPlannerMode,
  year,
  setYear,
  monthIndex,
  setMonthIndex,
  weekRangeText = "",
  onPrevWeek,
  onNextWeek,
  zoom,
  setZoom,
  onReset,
  onOpenExport,
  onApplyPreset,
  onOpenCompliance,
  onLoadTemplate,
  isFullscreen,
  onToggleFullscreen,
  draftSavedAt = null,
  onGoHome,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && onLoadTemplate) {
          onLoadTemplate(parsed);
        }
      } catch (err) {
        alert("Invalid template JSON file format.");
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be chosen again
    e.target.value = "";
  };
  const handlePrevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else {
      setMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else {
      setMonthIndex((m) => m + 1);
    }
  };

  const draftLabel = draftSavedAt
    ? `Draft saved ${draftSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : null;

  return (
    <header className="top-toolbar">
      {/* Brand & Title */}
      <div className="toolbar-left">
        <div className="brand-badge">
          <div className="brand-logo-icon">
            <CalendarDays size={18} />
          </div>
          <div className="brand-text">
            <span className="brand-title">PlanCraft</span>
            <span className="brand-subtitle">STUDIO</span>
          </div>
          {isPro ? (
            <span
              className="pro-pill pro-pill-active"
              title="Pro License Active"
            >
              PRO
            </span>
          ) : (
            <button
              type="button"
              className="pro-pill pro-pill-free"
              onClick={() => onOpenCompliance && onOpenCompliance("plans")}
              title="Free Plan — Click to view Pro plans"
            >
              FREE
            </button>
          )}
        </div>

        {onGoHome && (
          <button
            type="button"
            className="btn-toolbar-ghost btn-go-home"
            onClick={onGoHome}
            title="Back to home"
          >
            <Home size={14} />
            <span>Home</span>
          </button>
        )}

        {/* Mode Switcher: Monthly vs. Weekly */}
        <div className="planner-mode-toggle">
          <button
            type="button"
            className={`planner-mode-btn ${plannerMode === "monthly" ? "active" : ""}`}
            onClick={() => setPlannerMode && setPlannerMode("monthly")}
            title="Switch to Monthly Calendar"
          >
            <Calendar size={13} />
            <span>Monthly</span>
          </button>
          <button
            type="button"
            className={`planner-mode-btn ${plannerMode === "weekly" ? "active" : ""}`}
            onClick={() => setPlannerMode && setPlannerMode("weekly")}
            title="Switch to Weekly Plans"
          >
            <Layers size={13} />
            <span>Weekly</span>
          </button>
        </div>

        {/* Date / Month / Week Quick Nav */}
        {plannerMode === "monthly" && (
          <div className="month-quick-navigator">
            <button
              type="button"
              className="btn-nav-arrow"
              onClick={handlePrevMonth}
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="current-month-display">
              <Calendar size={14} className="text-orange-500" />
              <span className="month-label">
                {MONTH_NAMES[monthIndex]} {year}
              </span>
            </div>

            <button
              type="button"
              className="btn-nav-arrow"
              onClick={handleNextMonth}
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Center: Presets Quick Dropdown */}
      <div className="toolbar-center">
        <div className="presets-quick-bar">
          <Palette size={15} className="text-orange-500" />
          <span className="quick-bar-label">Template:</span>
          <select
            className="styled-select-toolbar"
            onChange={(e) => {
              const selected = PRESET_THEMES.find(
                (t) => t.id === e.target.value,
              );
              if (selected) onApplyPreset(selected);
            }}
            defaultValue=""
          >
            <option value="" disabled>
              ✨ Select Festival / Season...
            </option>
            <optgroup label="🌟 International Festivals of Lights">
              <option value="diwali">🪔 Diwali (Festival of Lights)</option>
              <option value="hanukkah">🕎 Hanukkah (Festival of Lights)</option>
            </optgroup>
            <optgroup label="❄️ Winter & Yuletide Roots">
              <option value="yule">🪵 Yule (Winter Solstice)</option>
              <option value="st_nicholas">👢 Saint Nicholas Day</option>
              <option value="three_kings">👑 Epiphany (Three Kings Day)</option>
              <option value="winter">❄️ Winter Holiday & Pine</option>
            </optgroup>
            <optgroup label="🍂 Autumn & Aesthetics">
              <option value="halloween">🎃 Spooky Halloween</option>
              <option value="autumn">🍂 Cozy Autumn Harvest</option>
              <option value="floral">🌸 Botanical Peony & Eucalyptus</option>
              <option value="minimal_sand">✨ Minimalist Linen & Gold</option>
              <option value="celestial_dark">🌌 Celestial Midnight Gold</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Right: Zoom & Export Actions */}
      <div className="toolbar-right">
        {draftLabel && (
          <div
            className="draft-saved-indicator"
            title="Autosaved to this browser"
          >
            <Cloud size={13} />
            <span>{draftLabel}</span>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="zoom-controls-group">
          <button
            type="button"
            className="btn-tool-icon"
            onClick={() =>
              setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(1))))
            }
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <span className="zoom-display-text">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="btn-tool-icon"
            onClick={() =>
              setZoom((z) => Math.min(1.8, Number((z + 0.1).toFixed(1))))
            }
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
          <button
            type="button"
            className="btn-tool-icon"
            onClick={() => setZoom(1)}
            title="Reset Zoom to 100%"
          >
            1:1
          </button>
        </div>

        {/* Hidden File Input for loading JSON Template */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".json,application/json"
          onChange={handleFileChange}
        />

        {/* Load JSON Template */}
        <button
          type="button"
          className="btn-toolbar-ghost"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          title="Reload a saved planner design template (.json)"
        >
          <Upload size={15} />
          <span>Load</span>
        </button>

        {/* Reset */}
        <button
          type="button"
          className="btn-toolbar-ghost"
          onClick={onReset}
          title="Reset to Defaults"
        >
          <RotateCcw size={15} />
          <span>Reset</span>
        </button>

        {/* Plans & Pricing Button */}
        <button
          type="button"
          className="btn-toolbar-ghost"
          onClick={() => onOpenCompliance && onOpenCompliance("plans")}
          title="View Pricing Plans & Licensing"
          style={{ color: "var(--accent-orange)" }}
        >
          <Tag size={15} />
          <span>Plans</span>
        </button>

        {/* Master Export Button */}
        <button
          type="button"
          className="btn-export-primary"
          onClick={onOpenExport}
        >
          <Download size={16} />
          <span>Export Planner</span>
          <span className="export-badge-tag">PDF / PNG</span>
        </button>
      </div>
    </header>
  );
}
