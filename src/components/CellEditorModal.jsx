import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Tag, Smile } from 'lucide-react';
import { STICKER_LIBRARY } from '../data/presetThemes';

export default function CellEditorModal({
  isOpen,
  cell,
  monthName,
  year,
  currentEvent,
  currentSticker,
  onSave,
  onDelete,
  onClose
}) {
  if (!isOpen || !cell) return null;

  const [title, setTitle] = useState(currentEvent?.title || '');
  const [color, setColor] = useState(currentEvent?.color || '#f97316');
  const [selectedSticker, setSelectedSticker] = useState(currentSticker || '');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setTitle(currentEvent?.title || '');
    setColor(currentEvent?.color || '#f97316');
    setSelectedSticker(currentSticker || '');
  }, [currentEvent, currentSticker, cell]);

  const categories = ['All', 'Halloween', 'Autumn', 'Floral', 'Cozy', 'Aesthetic', 'Productivity', 'Celebration'];

  const filteredStickers = selectedCategory === 'All' 
    ? STICKER_LIBRARY 
    : STICKER_LIBRARY.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      dateKey: cell.dateKey,
      event: title.trim() ? { title: title.trim(), color } : null,
      sticker: selectedSticker || null
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(cell.dateKey);
    onClose();
  };

  const badgeColors = [
    '#f97316', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', 
    '#3b82f6', '#8b5cf6', '#ec4899', '#475569', '#1e293b'
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Calendar size={18} className="text-orange-500" />
            <h3>Edit {cell.dayNumber ? `${monthName} ${cell.dayNumber}, ${year}` : (cell.dayName || monthName)}</h3>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="modal-body">
          
          {/* Event Title */}
          <div className="control-group">
            <label className="control-label">
              <Tag size={14} />
              <span>Event / Reminder Note</span>
            </label>
            <input
              type="text"
              className="text-input"
              placeholder="e.g. Halloween Night Party, Birthday, Project Due"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Color Tag Picker */}
          {title && (
            <div className="control-group">
              <label className="control-label">
                <span>Badge Color</span>
              </label>
              <div className="color-swatches-row">
                {badgeColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-swatch-btn ${color === c ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sticker / Icon Picker */}
          <div className="control-group">
            <div className="flex-between">
              <label className="control-label">
                <Smile size={14} />
                <span>Date Sticker</span>
              </label>
              {selectedSticker && (
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setSelectedSticker('')}
                >
                  Clear Sticker
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div className="sticker-category-tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`sticker-tab ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sticker Grid */}
            <div className="stickers-grid">
              {filteredStickers.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  className={`sticker-pick-btn ${selectedSticker === item.icon ? 'active' : ''}`}
                  onClick={() => setSelectedSticker(item.icon === selectedSticker ? '' : item.icon)}
                  title={item.label}
                >
                  <span className="sticker-emoji">{item.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            {(currentEvent || currentSticker) && (
              <button
                type="button"
                className="btn-danger-outline"
                onClick={handleDelete}
              >
                <Trash2 size={15} />
                <span>Clear Day</span>
              </button>
            )}

            <div className="modal-actions-right">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
