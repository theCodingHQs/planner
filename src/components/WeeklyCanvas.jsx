import React, { forwardRef } from "react";
import { getUndatedWeekDays } from "../utils/weeklyUtils";

const WeeklyCanvas = forwardRef(
  (
    {
      startOfWeek = 1, // 0 = Sunday, 1 = Monday
      customTitle,
      customSubtitle,
      bgImage,
      pageFormat,
      styles,
      weeklyLayout = "columns-7", // 'columns-7' | 'grid-8' | 'horizontal' | 'dashboard'
      weeklyInteriorStyle = "lines", // 'lines' | 'checkboxes' | 'schedule' | 'blank'
      events = {},
      stickers = {},
      onCellClick,
      zoom = 1,
      // Weekly Dashboard state
      weeklyPriorities = ["", "", ""],
      onPriorityChange,
      habits = [
        "Hydration (2L)",
        "Workout / Walk",
        "Read 20 Mins",
        "Sleep 8 Hours",
      ],
      onHabitChange,
      weeklyNotes = "",
      onWeeklyNotesChange,
    },
    ref,
  ) => {
    const weekDays = getUndatedWeekDays(startOfWeek);

    // Background filter style
    const bgFilter = `brightness(${styles.bgFilterBrightness || 100}%) contrast(${styles.bgFilterContrast || 100}%) saturate(${styles.bgFilterSaturation || 100}%) sepia(${styles.bgFilterWarmth || 0}%)`;

    // Compute hex to rgba
    const hexToRgba = (hex, opacity) => {
      let c = (hex || "#ffffff").replace("#", "");
      if (c.length === 3)
        c = c
          .split("")
          .map((x) => x + x)
          .join("");
      const num = parseInt(c, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const cellBg = hexToRgba(
      styles.cellBgColor || "#ffffff",
      styles.cellOpacity ?? 0.75,
    );
    const cellBorder = `${styles.cellBorderWidth || 1.5}px ${styles.cellBorderStyle || "solid"} ${hexToRgba(styles.cellBorderColor || "#e07a14", styles.cellBorderOpacity ?? 0.85)}`;
    const borderRadius = `${styles.cellBorderRadius || 4}px`;

    // Weekday Header Background Styling
    const headerBgMode = styles.headerBgMode || "none";
    const headerBgColor =
      styles.headerBgColor || styles.cellBgColor || "#ffffff";
    const headerBgOpacity =
      styles.headerBgOpacity !== undefined ? styles.headerBgOpacity : 0.82;
    const headerBg = hexToRgba(headerBgColor, headerBgOpacity);
    const headerBorder =
      styles.headerBorderWidth && styles.headerBorderWidth > 0
        ? `${styles.headerBorderWidth}px solid ${hexToRgba(styles.headerBorderColor || styles.cellBorderColor || "#e07a14", styles.headerBorderOpacity ?? 0.85)}`
        : "none";
    const headerBorderRadius = `${styles.headerBorderRadius !== undefined ? styles.headerBorderRadius : headerBgMode === "pill" ? 16 : 4}px`;

    // Render interior content inside a day box
    const renderBoxInterior = (day, lineCount = 8) => {
      if (weeklyInteriorStyle === "blank") {
        return null;
      }

      if (weeklyInteriorStyle === "checkboxes") {
        return (
          <div className="weekly-box-checkboxes">
            {Array.from({ length: lineCount }).map((_, idx) => (
              <div key={idx} className="weekly-checkbox-line">
                <span
                  className="weekly-box-check-square"
                  style={{ borderColor: styles.cellBorderColor }}
                />
                <span
                  className="weekly-box-rule"
                  style={{
                    borderBottomColor: hexToRgba(styles.cellBorderColor, 0.25),
                  }}
                />
              </div>
            ))}
          </div>
        );
      }

      if (weeklyInteriorStyle === "schedule") {
        const hours = [
          "8 AM",
          "10 AM",
          "12 PM",
          "2 PM",
          "4 PM",
          "6 PM",
          "8 PM",
        ];
        return (
          <div className="weekly-box-schedule">
            {hours.map((hour, idx) => (
              <div key={idx} className="weekly-schedule-row">
                <span
                  className="weekly-hour-label"
                  style={{ color: styles.dateColor, opacity: 0.65 }}
                >
                  {hour}
                </span>
                <span
                  className="weekly-box-rule"
                  style={{
                    borderBottomColor: hexToRgba(styles.cellBorderColor, 0.2),
                  }}
                />
              </div>
            ))}
          </div>
        );
      }

      // Default: 'lines' (handwriting ruled lines)
      return (
        <div className="weekly-box-ruled-lines">
          {Array.from({ length: lineCount }).map((_, idx) => (
            <span
              key={idx}
              className="weekly-ruled-line"
              style={{
                borderBottomColor: hexToRgba(styles.cellBorderColor, 0.25),
              }}
            />
          ))}
        </div>
      );
    };

    // Day Card Component
    const renderDayCard = (day, extraClass = "", lineCount = 8) => {
      const dateKey = day.dateKey;
      const dayEvent = events[dateKey];
      const daySticker = stickers[dateKey];

      return (
        <div
          key={day.dateKey}
          className={`weekly-day-card ${extraClass} ${day.isWeekend ? "weekend-day" : ""}`}
          onClick={() => onCellClick && onCellClick(day)}
          style={{
            backgroundColor: cellBg,
            border: cellBorder,
            borderRadius: borderRadius,
            backdropFilter: styles.cellGlassmorphism ? "blur(4px)" : "none",
            boxShadow: styles.cellElevation
              ? "0 1px 4px rgba(0,0,0,0.04)"
              : "none",
          }}
        >
          {/* Day Header Bar */}
          <div
            className={`weekly-day-header-bar weekday-bg-mode-${headerBgMode}`}
            style={{
              backgroundColor:
                headerBgMode !== "none" ? headerBg : "transparent",
              borderBottom:
                headerBgMode === "banner" || headerBgMode === "underline"
                  ? headerBorder
                  : "none",
              borderRadius: headerBgMode === "pill" ? headerBorderRadius : "0",
              padding: `${styles.headerPaddingY || 5}px 8px`,
              backdropFilter:
                headerBgMode !== "none" && styles.headerGlassmorphism
                  ? "blur(4px)"
                  : "none",
            }}
          >
            <div className="weekly-day-title-wrap">
              <span
                className="weekly-day-name"
                style={{
                  fontFamily: styles.headerFont,
                  color: styles.headerColor,
                  fontSize: `${styles.headerSize || 13}px`,
                  letterSpacing: `${styles.headerTracking || 1.5}px`,
                  fontWeight: styles.headerBold ? 700 : 600,
                  textTransform: styles.headerUppercase
                    ? "uppercase"
                    : "capitalize",
                  textShadow: styles.headerContrastShadow
                    ? "0 1px 3px rgba(0,0,0,0.35)"
                    : "none",
                }}
              >
                {styles.headerShort ? day.dayShort : day.dayName}
              </span>
            </div>

            {daySticker && (
              <span className="weekly-sticker-icon" title="Sticker">
                {daySticker}
              </span>
            )}
          </div>

          {/* Event Badge */}
          {dayEvent && (
            <div
              className="weekly-day-event-badge"
              style={{
                backgroundColor: dayEvent.color || "#f97316",
                color: dayEvent.textColor || "#ffffff",
              }}
            >
              <span>{dayEvent.title}</span>
            </div>
          )}

          {/* Interior Task Area */}
          <div className="weekly-card-body">
            {renderBoxInterior(day, lineCount)}
          </div>
        </div>
      );
    };

    return (
      <div
        className="canvas-viewport"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          transition: "transform 0.15s ease",
        }}
      >
        <div
          id="calendar-print-artboard"
          ref={ref}
          className="calendar-artboard weekly-artboard"
          style={{
            aspectRatio: `${pageFormat.ratio}`,
          }}
        >
          {/* Background Image Layer */}
          {bgImage && (
            <div
              className="artboard-background"
              style={{
                backgroundImage: `url(${bgImage})`,
                filter: bgFilter,
              }}
            />
          )}

          {/* Ambient Grain Overlay */}
          <div className="artboard-grain-overlay" />

          {/* Inner Content Area */}
          <div className="artboard-inner weekly-inner">
            {/* Top Header: Weekly Title & Date Range */}
            <div
              className="artboard-header weekly-header-top"
              style={{
                paddingTop: `${styles.headerTopPadding || 18}px`,
                transform: `translate(${styles.titleOffsetX || 0}px, ${styles.titleOffsetY || 0}px)`,
              }}
            >
              <div className="header-titles-group">
                <span
                  className="calendar-month-title weekly-title-main"
                  style={{
                    fontFamily: styles.titleFont,
                    color: styles.titleColor,
                    fontSize: `${styles.titleSize || 52}px`,
                    letterSpacing: `${styles.titleLetterSpacing || 1}px`,
                    textShadow: styles.showShadow
                      ? "0 2px 10px rgba(0,0,0,0.06)"
                      : "none",
                  }}
                >
                  {customTitle || "Weekly Planner"}
                </span>
              </div>

              {customSubtitle && (
                <div
                  className="calendar-subtitle"
                  style={{
                    fontFamily: styles.headerFont,
                    color: styles.headerColor,
                    opacity: 0.85,
                    marginTop: "4px",
                  }}
                >
                  {customSubtitle}
                </div>
              )}
            </div>

            {/* Main Layout Area */}
            <div
              className="artboard-main-layout weekly-main-layout"
              style={{
                width: `${styles.gridWidthPercent}%`,
                marginTop: `${styles.gridTopOffset}px`,
              }}
            >
              {/* --------------------------------------------- */}
              {/* LAYOUT 1: 7 Vertical Columns */}
              {/* --------------------------------------------- */}
              {weeklyLayout === "columns-7" && (
                <div className="weekly-layout-columns-7">
                  {weekDays.map((day) => renderDayCard(day, "col-card", 14))}
                </div>
              )}

              {/* --------------------------------------------- */}
              {/* LAYOUT 2: 8-Box Grid (4 Top + 4 Bottom) */}
              {/* --------------------------------------------- */}
              {weeklyLayout === "grid-8" && (
                <div className="weekly-layout-grid-8">
                  {/* Row 1: First 4 Days */}
                  <div className="grid-8-row">
                    {weekDays
                      .slice(0, 4)
                      .map((day) => renderDayCard(day, "grid-box", 7))}
                  </div>
                  {/* Row 2: Remaining 3 Days + Weekly Priorities Card */}
                  <div className="grid-8-row">
                    {weekDays
                      .slice(4, 7)
                      .map((day) => renderDayCard(day, "grid-box", 7))}

                    {/* 8th Box: Weekly Focus & Priorities */}
                    <div
                      className="weekly-day-card grid-box weekly-notes-card"
                      style={{
                        backgroundColor: cellBg,
                        border: cellBorder,
                        borderRadius: borderRadius,
                        backdropFilter: styles.cellGlassmorphism
                          ? "blur(4px)"
                          : "none",
                      }}
                    >
                      <div
                        className="weekly-day-header-bar"
                        style={{
                          backgroundColor:
                            headerBgMode !== "none" ? headerBg : "transparent",
                          borderBottom: headerBorder,
                          padding: `${styles.headerPaddingY || 5}px 8px`,
                        }}
                      >
                        <span
                          className="weekly-day-name"
                          style={{
                            fontFamily: styles.headerFont,
                            color: styles.headerColor,
                            fontSize: `${styles.headerSize || 13}px`,
                            letterSpacing: `${styles.headerTracking || 1.5}px`,
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          Weekly Goals & Notes
                        </span>
                      </div>
                      <div className="weekly-card-body">
                        <div className="weekly-box-checkboxes">
                          {Array.from({ length: 7 }).map((_, idx) => (
                            <div key={idx} className="weekly-checkbox-line">
                              <span
                                className="weekly-box-check-square"
                                style={{ borderColor: styles.cellBorderColor }}
                              />
                              <span
                                className="weekly-box-rule"
                                style={{
                                  borderBottomColor: hexToRgba(
                                    styles.cellBorderColor,
                                    0.25,
                                  ),
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --------------------------------------------- */}
              {/* LAYOUT 3: Split Horizontal Rows */}
              {/* --------------------------------------------- */}
              {weeklyLayout === "horizontal" && (
                <div className="weekly-layout-horizontal">
                  {/* Left Column: First 4 Days */}
                  <div className="horizontal-col">
                    {weekDays
                      .slice(0, 4)
                      .map((day) => renderDayCard(day, "horizontal-card", 4))}
                  </div>
                  {/* Right Column: Days 5-7 + Notes Card */}
                  <div className="horizontal-col">
                    {weekDays
                      .slice(4, 7)
                      .map((day) => renderDayCard(day, "horizontal-card", 4))}

                    {/* Notes Card */}
                    <div
                      className="weekly-day-card horizontal-card weekly-notes-card"
                      style={{
                        backgroundColor: cellBg,
                        border: cellBorder,
                        borderRadius: borderRadius,
                      }}
                    >
                      <div
                        className="weekly-day-header-bar"
                        style={{
                          backgroundColor:
                            headerBgMode !== "none" ? headerBg : "transparent",
                          borderBottom: headerBorder,
                          padding: `${styles.headerPaddingY || 5}px 8px`,
                        }}
                      >
                        <span
                          className="weekly-day-name"
                          style={{
                            fontFamily: styles.headerFont,
                            color: styles.headerColor,
                            fontSize: `${styles.headerSize || 13}px`,
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          Weekly Brain Dump & Notes
                        </span>
                      </div>
                      <div className="weekly-card-body">
                        <div className="weekly-box-ruled-lines">
                          {Array.from({ length: 4 }).map((_, idx) => (
                            <span
                              key={idx}
                              className="weekly-ruled-line"
                              style={{
                                borderBottomColor: hexToRgba(
                                  styles.cellBorderColor,
                                  0.25,
                                ),
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --------------------------------------------- */}
              {/* LAYOUT 4: Productivity Dashboard */}
              {/* --------------------------------------------- */}
              {weeklyLayout === "dashboard" && (
                <div className="weekly-layout-dashboard">
                  {/* Left: 7 Days Grid */}
                  <div className="dashboard-days-grid">
                    {weekDays.map((day) =>
                      renderDayCard(day, "dash-day-card", 5),
                    )}
                  </div>

                  {/* Right: Goals & Habit Tracker Sidebar Dashboard */}
                  <div
                    className="dashboard-sidebar-column"
                    style={{
                      backgroundColor: cellBg,
                      border: cellBorder,
                      borderRadius: borderRadius,
                      backdropFilter: styles.cellGlassmorphism
                        ? "blur(4px)"
                        : "none",
                    }}
                  >
                    {/* Section 1: Weekly Top 3 Focus */}
                    <div className="dashboard-widget-section">
                      <div
                        className="dashboard-widget-title"
                        style={{
                          fontFamily: styles.headerFont,
                          color: styles.headerColor,
                          fontSize: `${styles.headerSize || 12}px`,
                          letterSpacing: `${styles.headerTracking || 1}px`,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          borderBottom: cellBorder,
                        }}
                      >
                        🎯 Top 3 Priorities
                      </div>
                      <div className="dashboard-priorities-list">
                        {weeklyPriorities.map((p, pIdx) => (
                          <div key={pIdx} className="priority-input-row">
                            <span
                              className="priority-num-badge"
                              style={{ borderColor: styles.cellBorderColor }}
                            >
                              {pIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={p}
                              placeholder={`Priority #${pIdx + 1}...`}
                              onChange={(e) =>
                                onPriorityChange &&
                                onPriorityChange(pIdx, e.target.value)
                              }
                              className="sidebar-note-input"
                              style={{
                                fontFamily: styles.dateFont,
                                color: styles.dateColor,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 2: 7-Day Habit Tracker */}
                    <div className="dashboard-widget-section">
                      <div
                        className="dashboard-widget-title"
                        style={{
                          fontFamily: styles.headerFont,
                          color: styles.headerColor,
                          fontSize: `${styles.headerSize || 12}px`,
                          letterSpacing: `${styles.headerTracking || 1}px`,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          borderBottom: cellBorder,
                        }}
                      >
                        ✨ Habit Tracker
                      </div>
                      <div className="habit-tracker-matrix">
                        {/* Day Bubbles Header */}
                        <div className="habit-matrix-header">
                          <span className="habit-header-name">Habit</span>
                          <div className="habit-bubbles-row">
                            {weekDays.map((d, dIdx) => (
                              <span
                                key={dIdx}
                                className="habit-day-bubble"
                                style={{ color: styles.headerColor }}
                              >
                                {d.dayShort.slice(0, 1)}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Habits Rows */}
                        {habits.map((habit, hIdx) => (
                          <div key={hIdx} className="habit-row-item">
                            <input
                              type="text"
                              value={habit}
                              placeholder="Habit..."
                              onChange={(e) =>
                                onHabitChange &&
                                onHabitChange(hIdx, e.target.value)
                              }
                              className="sidebar-note-input habit-name-input"
                              style={{
                                fontFamily: styles.dateFont,
                                color: styles.dateColor,
                              }}
                            />
                            <div className="habit-bubbles-row">
                              {weekDays.map((_, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="habit-check-circle"
                                  style={{
                                    borderColor: hexToRgba(
                                      styles.cellBorderColor,
                                      0.4,
                                    ),
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 3: Notes & Brain Dump */}
                    <div className="dashboard-widget-section flex-1">
                      <div
                        className="dashboard-widget-title"
                        style={{
                          fontFamily: styles.headerFont,
                          color: styles.headerColor,
                          fontSize: `${styles.headerSize || 12}px`,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          borderBottom: cellBorder,
                        }}
                      >
                        📝 Weekly Notes
                      </div>
                      <div className="dashboard-notes-body">
                        <textarea
                          value={weeklyNotes}
                          placeholder="Weekly reminders, meal plans, or thoughts..."
                          onChange={(e) =>
                            onWeeklyNotesChange &&
                            onWeeklyNotesChange(e.target.value)
                          }
                          className="dashboard-textarea"
                          style={{
                            fontFamily: styles.dateFont,
                            color: styles.dateColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

WeeklyCanvas.displayName = "WeeklyCanvas";
export default WeeklyCanvas;
