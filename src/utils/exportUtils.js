import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

export async function exportToCanvas(element, scale = 3) {
  // Wait for all fonts and images to be settled
  if (document.fonts) {
    await document.fonts.ready;
  }
  
  const canvas = await html2canvas(element, {
    scale: scale, // 3x scale produces ~300 DPI razor-sharp prints
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    imageTimeout: 15000,
    onclone: (clonedDoc) => {
      // Ensure element in clone is visible and has no interactive outlines
      const clonedEl = clonedDoc.getElementById(element.id);
      if (clonedEl) {
        clonedEl.style.transform = 'none';
        clonedEl.style.boxShadow = 'none';
      }

      // Fix html2canvas input & textarea clipping bug:
      // html2canvas miscalculates the text baseline inside <input> and <textarea> elements.
      // In the cloned document, replace input & textarea elements with styled <div> elements.
      const inputs = clonedDoc.querySelectorAll('.sidebar-note-input, input[type="text"]');
      inputs.forEach((input) => {
        const textReplacement = clonedDoc.createElement('div');
        textReplacement.className = input.className;
        textReplacement.textContent = input.value || '';
        
        // Copy typography and layout styles
        const comp = window.getComputedStyle(input);
        textReplacement.style.fontFamily = input.style.fontFamily || comp.fontFamily;
        textReplacement.style.fontSize = comp.fontSize || '12px';
        textReplacement.style.fontWeight = comp.fontWeight || '400';
        textReplacement.style.color = input.style.color || comp.color;
        textReplacement.style.lineHeight = '1.4';
        textReplacement.style.padding = '3px 0 2px 0';
        textReplacement.style.border = 'none';
        textReplacement.style.borderBottom = input.style.borderBottom || comp.borderBottom || '1px dashed rgba(0, 0, 0, 0.25)';
        textReplacement.style.width = '100%';
        textReplacement.style.minHeight = '22px';
        textReplacement.style.overflow = 'visible';
        textReplacement.style.boxSizing = 'border-box';
        textReplacement.style.display = 'block';

        if (input.parentNode) {
          input.parentNode.replaceChild(textReplacement, input);
        }
      });

      const textareas = clonedDoc.querySelectorAll('textarea');
      textareas.forEach((ta) => {
        const taReplacement = clonedDoc.createElement('div');
        taReplacement.className = ta.className;
        taReplacement.textContent = ta.value || '';
        const comp = window.getComputedStyle(ta);
        taReplacement.style.fontFamily = ta.style.fontFamily || comp.fontFamily;
        taReplacement.style.fontSize = comp.fontSize || '11px';
        taReplacement.style.fontWeight = comp.fontWeight || '400';
        taReplacement.style.color = ta.style.color || comp.color;
        taReplacement.style.lineHeight = '1.4';
        taReplacement.style.whiteSpace = 'pre-wrap';
        taReplacement.style.wordBreak = 'break-word';
        taReplacement.style.width = '100%';
        taReplacement.style.height = 'auto';
        taReplacement.style.minHeight = '60px';
        taReplacement.style.overflow = 'visible';
        taReplacement.style.boxSizing = 'border-box';

        if (ta.parentNode) {
          ta.parentNode.replaceChild(taReplacement, ta);
        }
      });
    }
  });

  return canvas;
}

export async function exportToPNG(element, filename = 'monthly-planner.png') {
  try {
    const canvas = await exportToCanvas(element, 3);
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    
    triggerCelebration();
    return { success: true };
  } catch (err) {
    console.error('PNG export failed:', err);
    return { success: false, error: err.message };
  }
}

export async function exportToJPEG(element, filename = 'monthly-planner.jpg', quality = 0.95) {
  try {
    const canvas = await exportToCanvas(element, 3);
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    
    triggerCelebration();
    return { success: true };
  } catch (err) {
    console.error('JPEG export failed:', err);
    return { success: false, error: err.message };
  }
}

export async function exportToPDF(element, filename = 'monthly-planner.pdf', pageFormat = 'us-letter') {
  try {
    // 3x scale renders 300 DPI quality
    const canvas = await exportToCanvas(element, 3);
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Page format specs
    const isA4 = pageFormat === 'a4';
    const pdfFormat = isA4 ? 'a4' : 'letter'; // 'letter' in jsPDF is US Letter (8.5 x 11 in)
    const orientation = 'landscape';
    
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: pdfFormat,
      compress: true
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Fill page completely (borderless full-bleed print)
    pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    pdf.save(filename);

    triggerCelebration();
    return { success: true };
  } catch (err) {
    console.error('PDF export failed:', err);
    return { success: false, error: err.message };
  }
}

export async function copyImageToClipboard(element) {
  try {
    const canvas = await exportToCanvas(element, 2);
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Canvas blob conversion failed'));
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          triggerCelebration();
          resolve({ success: true });
        } catch (clipErr) {
          reject(clipErr);
        }
      }, 'image/png');
    });
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return { success: false, error: err.message };
  }
}

export function exportConfigJSON(config, filename = 'planner-template.json') {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataStr;
    link.click();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function triggerCelebration() {
  confetti({
    particleCount: 60,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#f97316', '#eab308', '#ec4899', '#3b82f6', '#10b981']
  });
}
