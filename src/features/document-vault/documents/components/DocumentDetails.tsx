import { useState } from 'react';
import {
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Share2,
  Download,
  Trash2,
  Edit,
  FileText,
  Calendar,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import type { Document } from '../types/document';

interface DocumentDetailsProps {
  document: Document;
  onClose: () => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: () => void;
}

export function DocumentDetails({
  document,
  onClose,
  onDownload,
  onShare,
  onDelete,
  onEdit,
}: DocumentDetailsProps) {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-50">
      <div className="flex-1 flex flex-col bg-white border-r border-slate-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Documents
            </button>
            <div className="w-px h-5 bg-slate-300" />
            <span className="text-sm text-slate-600">{document.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-slate-700 min-w-[3rem] text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-slate-200">
          <h1 className="text-xl font-semibold text-slate-800">
            {document.name}.{document.type.toLowerCase()}
          </h1>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-slate-100">
          <div
            className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
            style={{ width: `${zoom}%`, maxWidth: '800px' }}
          >
            {document.url && document.type.toUpperCase() === 'PDF' ? (
              <div className="w-full aspect-[8.5/11] bg-white">
                <iframe
                  src={`${document.url}#view=FitH`}
                  className="w-full h-full border-0"
                  title={document.name}
                />
              </div>
            ) : document.url &&
              (document.type.toUpperCase() === 'PNG' || document.type.toUpperCase() === 'JPEG') ? (
              <div className="w-full aspect-[8.5/11] bg-white flex items-center justify-center p-4">
                <img
                  src={document.url}
                  alt={document.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="aspect-[8.5/11] bg-white p-8 text-slate-600 text-sm">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{document.name}</h2>
                  <p className="text-slate-500">Document Preview</p>
                </div>
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-2">
                    <p className="font-semibold">Document Information</p>
                    <p className="text-slate-600 mt-1">Type: {document.type}</p>
                    <p className="text-slate-600">Size: {document.size}</p>
                  </div>
                  <div className="border-b border-slate-200 pb-2">
                    <p className="font-semibold">Upload Date</p>
                    <p className="text-slate-600 mt-1">{document.uploadedDate}</p>
                  </div>
                  <div className="h-32 bg-slate-100 rounded flex items-center justify-center">
                    <p className="text-slate-400">Document content preview...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="text-center mt-4 text-sm text-slate-500">Page 1 of 1</div>
        </div>
      </div>

      <aside className="w-80 bg-white flex flex-col shrink-0">
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-b border-slate-200">
          <button
            onClick={() => onShare?.(document.id)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={() => onDownload?.(document.id)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={() => onDelete?.(document.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">Properties</h3>
                <button
                  onClick={onEdit}
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Document Type</p>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-slate-700">
                      {document.type} Document
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Category</p>
                  <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
                    {document.category}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">File Size</p>
                  <span className="text-sm font-medium text-slate-700">{document.size}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      {document.status === 'verified' ? 'Verified' : document.status}
                    </span>
                  </div>
                </div>
                {document.notes && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Notes</p>
                    <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 whitespace-pre-wrap">
                      {document.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Upload className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">Uploaded</p>
                    <p className="text-xs text-slate-500">{document.uploadedDate}</p>
                  </div>
                </div>
                {document.modifiedDate && (
                  <div className="flex items-start gap-2">
                    <Edit className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">Modified</p>
                      <p className="text-xs text-slate-500">{document.modifiedDate}</p>
                    </div>
                  </div>
                )}
                {document.expiryDate && (
                  <div className="flex items-start gap-2">
                    <Calendar
                      className={`w-4 h-4 mt-0.5 ${
                        document.status === 'expiring' ? 'text-red-500' : 'text-slate-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          document.status === 'expiring' ? 'text-red-700' : 'text-slate-700'
                        }`}
                      >
                        Expiry
                      </p>
                      <p
                        className={`text-xs ${
                          document.status === 'expiring' ? 'text-red-600' : 'text-slate-500'
                        }`}
                      >
                        {document.expiryDate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
