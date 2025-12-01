import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Initialize PDF.js worker
// We use a CDN link compatible with the installed version usually, but for this environment, we try to auto-detect or use a standard one.
// Note: In a real prod build, this should be a local file or exact version match.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const readPdfText = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error("PDF Parse Error:", error);
    throw new Error("Failed to parse PDF. Please try copying the text manually.");
  }
};

export const readDocxText = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error("DOCX Parse Error:", error);
    throw new Error("Failed to parse Word document.");
  }
};

export const parseFile = async (file: File): Promise<string> => {
  const type = file.type;
  
  if (type === 'application/pdf') {
    return readPdfText(file);
  } else if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    type === 'application/msword'
  ) {
    return readDocxText(file);
  } else if (type === 'text/plain') {
    return await file.text();
  } else {
    throw new Error("Unsupported file type. Please use PDF, DOCX, or TXT.");
  }
};
