import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  Copy,
  Printer,
  Check,
  Zap,
  Loader2,
  Info,
  Layers,
  Lock,
  Key,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  exportToPDF,
  exportToPNG,
  exportToJPEG,
  copyImageToClipboard,
  exportConfigJSON,
} from "../utils/exportUtils";
import {
  getSavedLicense,
  verifyGumroadLicense,
  clearLicense,
  GUMROAD_PRODUCT_URL,
} from "../utils/gumroadService";

export default function ExportModal({
  isOpen,
  onClose,
  canvasRef,
  monthName,
  year,
  pageFormat,
  fullConfig,
  proLicense: externalProLicense,
  onLicenseChange,
}) {
  if (!isOpen) return null;

  const [exportingFormat, setExportingFormat] = useState(null);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  // Gumroad License & Pro State
  const [proLicense, setProLicense] = useState(externalProLicense || getSavedLicense());
  const [inputKey, setInputKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    // Check saved license whenever modal opens
    const saved = externalProLicense || getSavedLicense();
    if (saved) {
      setProLicense(saved);
    }
  }, [isOpen, externalProLicense]);

  const cleanName = (monthName || "planner")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-");
  const baseFileName =
    year && year !== "Undated"
      ? `${cleanName}-${year}-planner`
      : `${cleanName}`;

  const handleVerifyKey = async (e) => {
    if (e) e.preventDefault();
    if (!inputKey.trim()) {
      setVerifyError("Please enter your Gumroad license key.");
      return;
    }
    setIsVerifying(true);
    setVerifyError("");
    const res = await verifyGumroadLicense(inputKey);
    setIsVerifying(false);
    if (res.success) {
      setProLicense(res.data);
      if (onLicenseChange) onLicenseChange(res.data);
      setStatusMessage(res.message || "License verified! Pro exports unlocked 🎉");
      setInputKey("");
      setShowKeyInput(false);
    } else {
      setVerifyError(res.message);
    }
  };

  const handleOpenGumroad = () => {
    // Open Gumroad modal via gumroad.js or new tab
    if (window.GumroadOverlay) {
      window.GumroadOverlay.open({ url: GUMROAD_PRODUCT_URL });
    } else {
      window.open(GUMROAD_PRODUCT_URL, "_blank");
    }
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current) return;
    setExportingFormat("pdf");
    setStatusMessage("Generating 300 DPI vector-crisp PDF document...");

    const result = await exportToPDF(
      canvasRef.current,
      `${baseFileName}.pdf`,
      pageFormat.id,
    );
    setExportingFormat(null);
    if (result.success) {
      setStatusMessage("PDF exported successfully! 🎉");
      setTimeout(onClose, 1200);
    } else {
      setStatusMessage(`Export failed: ${result.error}`);
    }
  };

  const handleExportPNG = async () => {
    if (!canvasRef.current) return;
    setExportingFormat("png");
    setStatusMessage("Rendering ultra high-resolution PNG image...");

    const result = await exportToPNG(
      canvasRef.current,
      `${baseFileName}-hd.png`,
    );
    setExportingFormat(null);
    if (result.success) {
      setStatusMessage("PNG downloaded successfully! ✨");
      setTimeout(onClose, 1200);
    } else {
      setStatusMessage(`Export failed: ${result.error}`);
    }
  };

  const handleExportJPEG = async () => {
    if (!canvasRef.current) return;
    setExportingFormat("jpeg");
    setStatusMessage("Compressing high-quality JPEG...");

    const result = await exportToJPEG(
      canvasRef.current,
      `${baseFileName}.jpg`,
      0.95,
    );
    setExportingFormat(null);
    if (result.success) {
      setStatusMessage("JPEG downloaded successfully!");
      setTimeout(onClose, 1200);
    } else {
      setStatusMessage(`Export failed: ${result.error}`);
    }
  };

  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    setExportingFormat("copy");
    setStatusMessage("Copying calendar image to clipboard...");

    const result = await copyImageToClipboard(canvasRef.current);
    setExportingFormat(null);
    if (result.success) {
      setCopied(true);
      setStatusMessage(
        "Copied to clipboard! Ready to paste into Word, Photoshop, or GoodNotes.",
      );
      setTimeout(() => setCopied(false), 2500);
    } else {
      setStatusMessage(`Copy failed: ${result.error}`);
    }
  };

  const handleExportJSON = () => {
    exportConfigJSON(fullConfig, `${baseFileName}-template.json`);
    setStatusMessage("Template configuration saved!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-window export-modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Printer size={20} className="text-orange-500" />
            <div>
              <h3>
                Export Your{" "}
                {year === "Undated" ? "Weekly Planner" : "Monthly Planner"}
              </h3>
              <p className="modal-subtitle">
                Download high-resolution print files or save for digital planners
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="modal-body export-modal-body">
          {/* License Status Header Bar */}
          {proLicense ? (
            <div className="gumroad-license-active-bar">
              <div className="license-info-left">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <div>
                  <strong>Pro License Active ({proLicense.email || "Verified"})</strong>
                  <span className="license-sub">Unlimited 300 DPI high-res exports unlocked</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-text-dim"
                onClick={() => {
                  clearLicense();
                  setProLicense(null);
                  if (onLicenseChange) onLicenseChange(null);
                }}
                title="Change or switch license key"
              >
                Switch Key
              </button>
            </div>
          ) : (
            <div className="gumroad-license-locked-bar">
              <div className="locked-banner-content">
                <div className="locked-icon-badge">
                  <Lock size={20} />
                </div>
                <div className="locked-text-wrap">
                  <div className="locked-title-row">
                    <h4>High-Resolution 300 DPI Exports Require Pro</h4>
                    <span className="price-tag-badge">$9.99 Lifetime Access</span>
                  </div>
                  <p>
                    Unlock unlimited crisp vector PDFs and 3x Ultra HD PNGs. No subscriptions, instant access.
                  </p>
                </div>
              </div>

              <div className="locked-actions-row">
                <button
                  type="button"
                  className="btn-unlock-gumroad"
                  onClick={handleOpenGumroad}
                >
                  <Zap size={16} />
                  <span>Unlock Pro Lifetime Pass ($9.99)</span>
                  <ExternalLink size={14} />
                </button>

                <button
                  type="button"
                  className="btn-have-key"
                  onClick={() => setShowKeyInput(!showKeyInput)}
                >
                  <Key size={14} />
                  <span>{showKeyInput ? "Hide Key Input" : "Already have a License Key?"}</span>
                </button>
              </div>

              {/* License Key Verification Input Box */}
              {showKeyInput && (
                <form className="license-key-form animate-fade-in" onSubmit={handleVerifyKey}>
                  <div className="key-input-row">
                    <input
                      type="text"
                      className="gumroad-key-input"
                      placeholder="Paste license key (e.g. 6F0E4C97-...)"
                      value={inputKey}
                      onChange={(e) => {
                        setInputKey(e.target.value);
                        setVerifyError("");
                      }}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="btn-verify-key"
                      disabled={isVerifying || !inputKey.trim()}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <span>Verify & Unlock</span>
                      )}
                    </button>
                  </div>
                  {verifyError && (
                    <div className="verify-error-text">
                      {verifyError}
                    </div>
                  )}
                </form>
              )}
            </div>
          )}

          {statusMessage && (
            <div
              className={`export-status-banner ${exportingFormat ? "loading" : "done"}`}
            >
              {exportingFormat ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="export-cards-grid">
            {/* PDF Card (Recommended for Print) */}
            <div className="export-option-card primary-card">
              <div className="card-badge">RECOMMENDED FOR PRINT</div>
              <div className="export-card-icon pdf-icon">
                <FileText size={28} />
              </div>
              <h4>Print-Ready PDF</h4>
              <p>
                High-resolution 300 DPI vector print format. Crisp line art and vibrant colors for home printers or print shops.
              </p>
              <div className="format-meta">
                <span>{pageFormat.name}</span>
                <span>• 300 DPI</span>
              </div>
              <button
                className="btn-export-action btn-pdf"
                onClick={proLicense ? handleExportPDF : () => setShowKeyInput(true)}
                disabled={exportingFormat !== null}
              >
                {exportingFormat === "pdf" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : proLicense ? (
                  <>
                    <Download size={16} />
                    <span>Download PDF (300 DPI)</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Unlock Pro to Download</span>
                  </>
                )}
              </button>
            </div>

            {/* PNG Card (High-res Graphic) */}
            <div className="export-option-card">
              <div className="export-card-icon png-icon">
                <ImageIcon size={28} />
              </div>
              <h4>Ultra HD PNG</h4>
              <p>
                Lossless 3x scale raster image with crisp details and rich
                depth. Ideal for digital tablets and note apps.
              </p>
              <div className="format-meta">
                <span>Lossless Quality</span>
                <span>• Full Bleed</span>
              </div>
              <button
                className="btn-export-action btn-png"
                onClick={proLicense ? handleExportPNG : () => setShowKeyInput(true)}
                disabled={exportingFormat !== null}
              >
                {exportingFormat === "png" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Generating PNG...</span>
                  </>
                ) : proLicense ? (
                  <>
                    <Download size={16} />
                    <span>Download HD PNG</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Unlock Pro to Download</span>
                  </>
                )}
              </button>
            </div>

            {/* JPEG Card */}
            <div className="export-option-card">
              <div className="export-card-icon jpg-icon">
                <ImageIcon size={28} />
              </div>
              <h4>Standard JPEG</h4>
              <p>
                Compressed photo format suitable for web sharing, email
                newsletters, and quick digital reviews.
              </p>
              <div className="format-meta">
                <span>95% Quality</span>
                <span>• Lightweight</span>
              </div>
              <button
                className="btn-export-action btn-jpeg"
                onClick={proLicense ? handleExportJPEG : () => setShowKeyInput(true)}
                disabled={exportingFormat !== null}
              >
                {exportingFormat === "jpeg" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : proLicense ? (
                  <>
                    <Download size={16} />
                    <span>Download JPEG</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Unlock Pro to Download</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Actions Card */}
            <div className="export-option-card">
              <div className="export-card-icon tool-icon">
                <Layers size={28} />
              </div>
              <h4>Tools & Sharing</h4>
              <p>
                Copy high-res graphic to clipboard or export your
                custom template configuration file to reload anytime.
              </p>

              <div className="quick-actions-stack">
                <button
                  className="btn-quick-export"
                  onClick={proLicense ? handleCopyClipboard : () => setShowKeyInput(true)}
                  disabled={exportingFormat !== null}
                >
                  {copied ? (
                    <Check size={15} className="text-green-500" />
                  ) : proLicense ? (
                    <Copy size={15} />
                  ) : (
                    <Lock size={14} className="text-amber-500" />
                  )}
                  <span>
                    {copied
                      ? "Copied to Clipboard!"
                      : proLicense
                      ? "Copy to Clipboard"
                      : "Copy to Clipboard (Pro)"}
                  </span>
                </button>

                <button 
                  className="btn-quick-export btn-quick-export-free" 
                  onClick={handleExportJSON}
                  title="Download and save your complete planner configuration for free!"
                >
                  <div className="btn-quick-export-left">
                    <Download size={15} className="text-emerald-400" />
                    <span>Save Design Template (.json)</span>
                  </div>
                  <span className="free-feature-pill">FREE</span>
                </button>
              </div>
            </div>
          </div>

          {/* Printing Tips */}
          <div className="pro-tip-box">
            <Info size={18} className="text-amber-500" />
            <div>
              <strong>Printing Recommendation:</strong>
              <p>
                For the crispest planner prints, choose <strong>Print-Ready PDF</strong> with 100% scale (Do Not Scale / Actual Size) in your printer dialog on standard or heavy paper stock (100–120 gsm).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
