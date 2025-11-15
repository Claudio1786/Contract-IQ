'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui';

// Types for PDF.js integration
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export interface PDFHighlight {
  pageNumber: number;
  textContent: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  color: 'yellow' | 'green' | 'red' | 'blue';
  note?: string;
}

export interface PDFViewerProps {
  fileUrl?: string;
  fileData?: Uint8Array;
  highlights?: PDFHighlight[];
  onHighlightCreate?: (highlight: PDFHighlight) => void;
  onPageChange?: (pageNumber: number) => void;
  className?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  fileUrl,
  fileData,
  highlights = [],
  onHighlightCreate,
  onPageChange,
  className = ''
}) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load PDF.js library
  useEffect(() => {
    const loadPDFJS = async () => {
      if (window.pdfjsLib) {
        setIsLibraryLoaded(true);
        return;
      }

      try {
        // Load PDF.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          setIsLibraryLoaded(true);
        };
        script.onerror = () => setError('Failed to load PDF.js library');
        document.head.appendChild(script);
      } catch (err) {
        setError('Failed to load PDF.js library');
      }
    };

    loadPDFJS();
  }, []);

  // Load PDF document
  useEffect(() => {
    if (!isLibraryLoaded || (!fileUrl && !fileData)) return;

    const loadPDF = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const loadingTask = fileUrl 
          ? window.pdfjsLib.getDocument(fileUrl)
          : window.pdfjsLib.getDocument({ data: fileData });
        
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        setError(`Failed to load PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [isLibraryLoaded, fileUrl, fileData]);

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;
        
        const viewport = page.getViewport({ scale });
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        
        await page.render(renderContext).promise;
        
        // Apply highlights for current page
        applyHighlights(currentPage);
        
      } catch (err) {
        setError(`Failed to render page: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale, highlights]);

  const applyHighlights = (pageNumber: number) => {
    if (!canvasRef.current || !containerRef.current) return;

    // Remove existing highlights
    const existingHighlights = containerRef.current.querySelectorAll('.pdf-highlight');
    existingHighlights.forEach(highlight => highlight.remove());

    // Add highlights for current page
    const pageHighlights = highlights.filter(h => h.pageNumber === pageNumber);
    
    pageHighlights.forEach(highlight => {
      const highlightEl = document.createElement('div');
      highlightEl.className = `pdf-highlight pdf-highlight-${highlight.color}`;
      highlightEl.style.position = 'absolute';
      highlightEl.style.left = `${highlight.bounds.x * scale}px`;
      highlightEl.style.top = `${highlight.bounds.y * scale}px`;
      highlightEl.style.width = `${highlight.bounds.width * scale}px`;
      highlightEl.style.height = `${highlight.bounds.height * scale}px`;
      highlightEl.style.pointerEvents = 'none';
      highlightEl.style.opacity = '0.3';
      
      // Set highlight color
      const colorMap = {
        yellow: '#ffff00',
        green: '#00ff00',
        red: '#ff0000',
        blue: '#0000ff'
      };
      highlightEl.style.backgroundColor = colorMap[highlight.color];
      
      if (highlight.note) {
        highlightEl.title = highlight.note;
        highlightEl.style.pointerEvents = 'auto';
        highlightEl.style.cursor = 'help';
      }
      
      containerRef.current!.appendChild(highlightEl);
    });
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      onPageChange?.(pageNumber);
    }
  };

  const zoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.5));
  const resetZoom = () => setScale(1.2);

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 border border-gray-300 rounded ${className}`}>
        <div className="text-center">
          <div className="text-red-600 text-2xl mb-2">⚠️</div>
          <div className="text-sm font-medium text-gray-900 mb-1">PDF Load Error</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading || !isLibraryLoaded) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 border border-gray-300 rounded ${className}`}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <div className="text-sm text-gray-600">
            {!isLibraryLoaded ? 'Loading PDF.js library...' : 'Loading PDF...'}
          </div>
        </div>
      </div>
    );
  }

  if (!pdfDoc) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 border border-gray-300 rounded ${className}`}>
        <div className="text-center">
          <div className="text-gray-400 text-2xl mb-2">📄</div>
          <div className="text-sm text-gray-600">No PDF loaded</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-300 rounded ${className}`}>
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-3 border-b border-gray-300 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            ← Prev
          </Button>
          
          <span className="text-sm text-gray-700 px-3">
            {currentPage} of {totalPages}
          </span>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next →
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" onClick={zoomOut}>🔍-</Button>
          <span className="text-sm text-gray-700 px-2">
            {Math.round(scale * 100)}%
          </span>
          <Button size="sm" variant="ghost" onClick={zoomIn}>🔍+</Button>
          <Button size="sm" variant="ghost" onClick={resetZoom}>Reset</Button>
        </div>
      </div>
      
      {/* PDF Canvas Container */}
      <div 
        ref={containerRef} 
        className="relative overflow-auto max-h-[600px] bg-gray-100"
        style={{ padding: '20px' }}
      >
        <canvas 
          ref={canvasRef}
          className="border border-gray-300 shadow-sm mx-auto block"
        />
      </div>
      
      {/* Highlight Legend */}
      {highlights.length > 0 && (
        <div className="p-3 border-t border-gray-300 bg-gray-50">
          <div className="text-xs text-gray-600 mb-2">Highlights:</div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-400 opacity-60"></div>
              <span className="text-xs text-gray-700">Key Terms</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-400 opacity-60"></div>
              <span className="text-xs text-gray-700">Risks</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-400 opacity-60"></div>
              <span className="text-xs text-gray-700">Favorable</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};