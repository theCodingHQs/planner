import React, { forwardRef } from "react";
import {
  generateCalendarGrid,
  WEEKDAYS_SUNDAY,
  WEEKDAYS_MONDAY,
  WEEKDAYS_SHORT_SUN,
  WEEKDAYS_SHORT_MON,
} from "../utils/calendarUtils";

const CalendarCanvas = forwardRef(
  (
    {
      year,
      monthIndex,
      monthName,
      startOfWeek, // 0 = Sunday, 1 = Monday
      customTitle,
      customYear,
      subtitle,
      bgImage,
      pageFormat,
      styles,
      events = {},
      stickers = {},
      onCellClick,
      zoom = 1,
      showNotesColumn = false,
      notesColumnTitle = "Monthly Goals & Notes",
      notesList = ["", "", "", ""],
      onNotesChange,
    },
    ref,
  ) => {
    const gridData = generateCalendarGrid(year, monthIndex, startOfWeek);
    const weekdays =
      startOfWeek === 1
        ? styles.headerShort
          ? WEEKDAYS_SHORT_MON
          : WEEKDAYS_MONDAY
        : styles.headerShort
          ? WEEKDAYS_SHORT_SUN
          : WEEKDAYS_SUNDAY;

    // Background filter style
    const bgFilter = `brightness(${styles.bgFilterBrightness || 100}%) contrast(${styles.bgFilterContrast || 100}%) saturate(${styles.bgFilterSaturation || 100}%) sepia(${styles.bgFilterWarmth || 0}%)`;

    // Compute cell background with opacity
    const hexToRgba = (hex, opacity) => {
      let c = hex.replace("#", "");
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

    // Weekday Header Background Styling
    const headerBgMode = styles.headerBgMode || "none"; // 'none' | 'banner' | 'pill' | 'underline'
    const headerBgColor =
      styles.headerBgColor || styles.cellBgColor || "#ffffff";
    const headerBgOpacity =
      styles.headerBgOpacity !== undefined ? styles.headerBgOpacity : 0.82;
    const headerBg = hexToRgba(headerBgColor, headerBgOpacity);

    const headerBorderColor =
      styles.headerBorderColor || styles.cellBorderColor || "#e07a14";
    const headerBorderOpacity =
      styles.headerBorderOpacity !== undefined
        ? styles.headerBorderOpacity
        : 0.85;
    const headerBorderWidth =
      styles.headerBorderWidth !== undefined ? styles.headerBorderWidth : 1.2;
    const headerBorder =
      headerBorderWidth > 0
        ? `${headerBorderWidth}px solid ${hexToRgba(headerBorderColor, headerBorderOpacity)}`
        : "none";
    const headerBorderRadius = `${styles.headerBorderRadius !== undefined ? styles.headerBorderRadius : headerBgMode === "pill" ? 16 : 4}px`;
    const headerPaddingY =
      styles.headerPaddingY !== undefined ? styles.headerPaddingY : 5;
    const headerMarginBottom =
      styles.headerMarginBottom !== undefined ? styles.headerMarginBottom : 6;

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
          className="calendar-artboard"
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

          {/* Ambient Overlay Texture */}
          <div className="artboard-grain-overlay" />

          {/* Artboard Content Container */}
          <div className="artboard-inner">
            {/* Header Area with Month, Year, Subtitle */}
            <div
              className="artboard-header"
              style={{
                paddingTop: `${styles.headerTopPadding || 20}px`,
                transform: `translate(${styles.titleOffsetX || 0}px, ${styles.titleOffsetY || 0}px)`,
              }}
            >
              <div className="header-titles-group">
                <span
                  className="calendar-month-title"
                  style={{
                    fontFamily: styles.titleFont,
                    color: styles.titleColor,
                    fontSize: `${styles.titleSize}px`,
                    letterSpacing: `${styles.titleLetterSpacing}px`,
                    textShadow: styles.showShadow
                      ? "0 2px 10px rgba(0,0,0,0.06)"
                      : "none",
                  }}
                >
                  {customTitle || monthName}
                </span>
                <span
                  className="calendar-year-title"
                  style={{
                    fontFamily: styles.yearFont || styles.titleFont,
                    color: styles.titleColor,
                    fontSize: `${styles.yearSize || styles.titleSize * 0.7}px`,
                    marginLeft: "18px",
                    fontWeight: 600,
                    opacity: 0.95,
                  }}
                >
                  {customYear || year}
                </span>
              </div>

              {subtitle && (
                <div
                  className="calendar-subtitle"
                  style={{
                    fontFamily: styles.headerFont,
                    color: styles.headerColor,
                    opacity: 0.85,
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>

            {/* Main Grid & Optional Sidebar Row */}
            <div
              className="artboard-main-layout"
              style={{
                width: `${styles.gridWidthPercent}%`,
                marginTop: `${styles.gridTopOffset}px`,
              }}
            >
              {/* Calendar Grid Container */}
              <div className="calendar-grid-wrapper">
                {/* Weekday Column Headers */}
                <div
                  className={`weekday-header-row weekday-bg-mode-${headerBgMode}`}
                  style={{
                    backgroundColor:
                      headerBgMode === "banner"
                        ? headerBg
                        : headerBgMode === "underline" && headerBgOpacity > 0
                          ? headerBg
                          : "transparent",
                    border: headerBgMode === "banner" ? headerBorder : "none",
                    borderBottom:
                      headerBgMode === "underline"
                        ? headerBorderWidth > 0
                          ? headerBorder
                          : `2px solid ${hexToRgba(headerBorderColor, headerBorderOpacity)}`
                        : undefined,
                    borderRadius:
                      headerBgMode === "banner" ? headerBorderRadius : "0",
                    padding:
                      headerBgMode === "banner"
                        ? `${headerPaddingY}px 4px`
                        : headerBgMode === "underline"
                          ? `${headerPaddingY}px 0`
                          : "0",
                    marginBottom: `${headerMarginBottom}px`,
                    gap: headerBgMode === "pill" ? "4px" : "0",
                    backdropFilter:
                      headerBgMode === "banner" && styles.headerGlassmorphism
                        ? "blur(4px)"
                        : "none",
                    boxShadow:
                      headerBgMode === "banner" && styles.headerShadow
                        ? "0 2px 6px rgba(0,0,0,0.06)"
                        : "none",
                  }}
                >
                  {weekdays.map((dayName, idx) => (
                    <div
                      key={idx}
                      className="weekday-header-cell"
                      style={{
                        fontFamily: styles.headerFont,
                        color: styles.headerColor,
                        fontSize: `${styles.headerSize}px`,
                        letterSpacing: `${styles.headerTracking}px`,
                        fontWeight: styles.headerBold ? 700 : 500,
                        textTransform: styles.headerUppercase
                          ? "uppercase"
                          : "capitalize",
                        textAlign: styles.headerAlign || "center",
                        backgroundColor:
                          headerBgMode === "pill" ? headerBg : "transparent",
                        border: headerBgMode === "pill" ? headerBorder : "none",
                        borderRadius:
                          headerBgMode === "pill" ? headerBorderRadius : "0",
                        padding:
                          headerBgMode === "pill"
                            ? `${headerPaddingY}px 2px`
                            : "6px 2px",
                        backdropFilter:
                          headerBgMode === "pill" && styles.headerGlassmorphism
                            ? "blur(4px)"
                            : "none",
                        boxShadow:
                          headerBgMode === "pill" && styles.headerShadow
                            ? "0 2px 6px rgba(0,0,0,0.06)"
                            : "none",
                        textShadow: styles.headerContrastShadow
                          ? "0 1px 3px rgba(0,0,0,0.35)"
                          : "none",
                      }}
                    >
                      {dayName}
                    </div>
                  ))}
                </div>

                {/* Day Cells Matrix */}
                <div className="calendar-cells-matrix">
                  {gridData.rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="calendar-row">
                      {row.map((cell, cellIdx) => {
                        const isLeadingEmpty = cell.isLeading;
                        const isTrailingEmpty = cell.isTrailing;
                        const isCurrentMonth = cell.isCurrentMonth;
                        const isWeekend =
                          (startOfWeek === 0 &&
                            (cellIdx === 0 || cellIdx === 6)) ||
                          (startOfWeek === 1 &&
                            (cellIdx === 5 || cellIdx === 6));

                        // Check empty cell styling mode (Screenshot mode = 'hide')
                        const shouldHide =
                          !isCurrentMonth && styles.emptyCellMode === "hide";
                        const shouldFade =
                          !isCurrentMonth && styles.emptyCellMode === "fade";

                        const dateKey = cell.dateKey;
                        const cellEvent = events[dateKey];
                        const cellSticker = stickers[dateKey];

                        if (shouldHide) {
                          return (
                            <div
                              key={cellIdx}
                              className="calendar-cell cell-hidden"
                              style={{
                                visibility: "hidden",
                                border: "none",
                                background: "transparent",
                              }}
                            />
                          );
                        }

                        return (
                          <div
                            key={cellIdx}
                            onClick={() =>
                              isCurrentMonth && onCellClick && onCellClick(cell)
                            }
                            className={`calendar-cell ${isCurrentMonth ? "cell-active" : "cell-faded"} ${isWeekend ? "cell-weekend" : ""}`}
                            style={{
                              backgroundColor: shouldFade
                                ? "transparent"
                                : cellBg,
                              border: shouldFade
                                ? `1px dashed ${hexToRgba(styles.cellBorderColor, 0.25)}`
                                : cellBorder,
                              borderRadius: `${styles.cellBorderRadius || 0}px`,
                              boxShadow: styles.cellElevation
                                ? "0 1px 4px rgba(0,0,0,0.04)"
                                : "none",
                              cursor: isCurrentMonth ? "pointer" : "default",
                              backdropFilter: styles.cellGlassmorphism
                                ? "blur(4px)"
                                : "none",
                            }}
                          >
                            {/* Top row of cell: Date Number & Sticker */}
                            <div
                              className={`cell-header-bar position-${styles.datePosition || "top-right"}`}
                            >
                              {cellSticker && (
                                <span
                                  className="cell-sticker-badge"
                                  title="Event Sticker"
                                >
                                  {cellSticker}
                                </span>
                              )}

                              <span
                                className="cell-day-number"
                                style={{
                                  fontFamily: styles.dateFont,
                                  color:
                                    isWeekend && styles.highlightWeekends
                                      ? styles.weekendColor || "#e11d48"
                                      : styles.dateColor,
                                  fontSize: `${styles.dateSize || 14}px`,
                                  opacity: isCurrentMonth ? 1 : 0.35,
                                  fontWeight: styles.dateBold ? 700 : 500,
                                }}
                              >
                                {cell.dayNumber}
                              </span>
                            </div>

                            {/* Ruled lines for handwritten notes if enabled */}
                            {styles.showNotesLines && (
                              <div className="cell-ruled-lines">
                                <span className="rule-line" />
                                <span className="rule-line" />
                                <span className="rule-line" />
                              </div>
                            )}

                            {/* Event / Holiday Badge */}
                            {cellEvent && isCurrentMonth && (
                              <div
                                className="cell-event-badge"
                                style={{
                                  backgroundColor: cellEvent.color || "#f97316",
                                  color: cellEvent.textColor || "#ffffff",
                                }}
                              >
                                <span className="event-title-text">
                                  {cellEvent.title}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Side Goals / Notes Column */}
              {showNotesColumn && (
                <div
                  className="calendar-sidebar-column"
                  style={{
                    backgroundColor: cellBg,
                    border: cellBorder,
                    borderRadius: `${styles.cellBorderRadius || 0}px`,
                    backdropFilter: styles.cellGlassmorphism
                      ? "blur(4px)"
                      : "none",
                  }}
                >
                  <div
                    className="sidebar-column-title"
                    style={{
                      fontFamily: styles.headerFont,
                      color: styles.headerColor,
                      fontSize: `${styles.headerSize}px`,
                      letterSpacing: `${styles.headerTracking}px`,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      borderBottom: cellBorder,
                    }}
                  >
                    {notesColumnTitle}
                  </div>
                  <div className="sidebar-notes-body">
                    {notesList.map((note, nIdx) => (
                      <div key={nIdx} className="sidebar-note-row">
                        <span
                          className="note-checkbox"
                          style={{ borderColor: styles.cellBorderColor }}
                        />
                        <input
                          type="text"
                          value={note}
                          placeholder={`Goal #${nIdx + 1}...`}
                          onChange={(e) =>
                            onNotesChange && onNotesChange(nIdx, e.target.value)
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
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

CalendarCanvas.displayName = "CalendarCanvas";
export default CalendarCanvas;
