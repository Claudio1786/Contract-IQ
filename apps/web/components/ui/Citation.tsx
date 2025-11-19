import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const citationVariants = cva(
  'inline-flex items-center px-2 py-1 text-xs font-mono rounded cursor-pointer transition-all hover:scale-105',
  {
    variants: {
      variant: {
        default: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        success: 'bg-green-100 text-green-800 hover:bg-green-200',
        warning: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
        danger: 'bg-red-100 text-red-800 hover:bg-red-200'
      },
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-1 text-xs',
        lg: 'px-2.5 py-1.5 text-sm'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

export interface CitationProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof citationVariants> {
  source: string;
  content: string;
  page?: number;
  section?: string;
  confidence?: number;
  onPreview?: (citation: CitationData) => void;
}

export interface CitationData {
  source: string;
  content: string;
  page?: number;
  section?: string;
  confidence?: number;
}

const Citation = React.forwardRef<HTMLSpanElement, CitationProps>(
  ({ className, variant, size, source, content, page, section, confidence, onPreview, children, ...props }, ref) => {
    const [showPreview, setShowPreview] = useState(false);
    
    const citationData: CitationData = {
      source,
      content,
      page,
      section,
      confidence
    };

    const handleClick = () => {
      onPreview?.(citationData);
    };

    const handleMouseEnter = () => setShowPreview(true);
    const handleMouseLeave = () => setShowPreview(false);

    // Generate citation label
    const label = children || `${source}${page ? `, p.${page}` : ''}${section ? `, §${section}` : ''}`;

    return (
      <span className="relative inline-block">
        <span
          ref={ref}
          className={citationVariants({ variant, size, className })}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          📄 {label}
          {confidence && (
            <span className="ml-1 text-xs opacity-60">
              ({Math.round(confidence * 100)}%)
            </span>
          )}
        </span>
        
        {/* Preview tooltip */}
        {showPreview && (
          <div className="absolute z-20 w-80 p-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl">
            <div className="flex justify-between items-start mb-2">
              <div className="text-xs font-medium text-gray-700">
                📄 {source}
              </div>
              {confidence && (
                <div className={`text-xs px-2 py-1 rounded ${
                  confidence > 0.8 
                    ? 'bg-green-100 text-green-700' 
                    : confidence > 0.6 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {Math.round(confidence * 100)}% confident
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-500 mb-2">
              {page && `Page ${page}`}
              {section && ` • Section ${section}`}
            </div>
            
            <div className="text-sm text-gray-900 leading-relaxed">
              {content.length > 200 ? `${content.slice(0, 200)}...` : content}
            </div>
            
            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-400">
                💡 Click to view full context
              </div>
            </div>
          </div>
        )}
      </span>
    );
  }
);

Citation.displayName = 'Citation';

// Citation Preview Panel Component
export interface CitationPreviewProps {
  citation: CitationData | null;
  onClose: () => void;
  onNavigate?: (citation: CitationData) => void;
}

const CitationPreview: React.FC<CitationPreviewProps> = ({ citation, onClose, onNavigate }) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{citation.source}</h3>
              <div className="text-sm text-gray-500">
                {citation.page && `Page ${citation.page}`}
                {citation.section && ` • Section ${citation.section}`}
                {citation.confidence && ` • ${Math.round(citation.confidence * 100)}% confidence`}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{citation.content}</p>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Click citation to view in document context
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate(citation)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                View in Document
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Citation, CitationPreview, citationVariants };