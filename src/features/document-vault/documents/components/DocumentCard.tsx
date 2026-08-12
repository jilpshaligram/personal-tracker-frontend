import { FileText, Calendar, Clock, MoreVertical, AlertTriangle } from 'lucide-react';
import type { Document } from '../types/document';

interface DocumentCardProps {
  document: Document;
  onClick: (document: Document) => void;
}

export function DocumentCard({ document, onClick }: DocumentCardProps) {
  const expiryInfo = (() => {
    if (!document.expiryDate) return null;

    const expiry = new Date(document.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isExpired = diffDays < 0 || document.status.toLowerCase() === 'expired';
    const isExpiringSoon = !isExpired && diffDays <= 30;

    return {
      diffDays,
      isExpired,
      isExpiringSoon,
    };
  })();

  const getThumbnailUrl = () => {
    if (!document.url) return null;
    const typeUpper = document.type.toUpperCase();
    if (typeUpper === 'PNG' || typeUpper === 'JPEG' || typeUpper === 'JPG') {
      return document.url;
    }
    if (typeUpper === 'PDF') {
      return document.url.replace(/\.pdf$/i, '.png');
    }
    return null;
  };

  const thumbnailUrl = getThumbnailUrl();
  const hasExpiryWarning = expiryInfo?.isExpired || expiryInfo?.isExpiringSoon;

  return (
    <div
      onClick={() => onClick(document)}
      className={`group relative bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
        hasExpiryWarning
          ? 'border-red-500 hover:border-red-600'
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      {/* Expiry Warning Badge */}
      {expiryInfo?.isExpired && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-red-600 text-white text-[10px] font-semibold px-2 py-1 rounded shadow-md">
          <AlertTriangle className="w-3 h-3" />
          Expired
        </div>
      )}
      {!expiryInfo?.isExpired && expiryInfo?.isExpiringSoon && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-red-600 text-white text-[10px] font-semibold px-2 py-1 rounded shadow-md">
          <AlertTriangle className="w-3 h-3" />
          Expiring in {expiryInfo.diffDays} {expiryInfo.diffDays === 1 ? 'day' : 'days'}
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative aspect-4/3 bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" />
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={document.name}
            className="w-full h-full object-cover relative z-10 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <FileText className="w-16 h-16 text-slate-300 relative z-10" />
        )}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/5 z-20 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 text-sm mb-2 truncate">{document.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
            {document.category}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {document.type} • {document.size}
          </span>
        </div>

        {document.expiryDate ? (
          <div
            className={`flex items-center gap-1 mt-3 text-xs font-medium ${
              hasExpiryWarning ? 'text-red-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <Calendar
              className={`w-3.5 h-3.5 ${hasExpiryWarning ? 'text-red-500' : 'text-slate-400'}`}
            />
            <span>Expires: {document.expiryDate}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 mt-3 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Uploaded: {document.uploadedDate}</span>
          </div>
        )}
      </div>

      {/* More Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          // Handle more actions
        }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 bg-white rounded-lg shadow-sm hover:bg-slate-50 transition-all z-20"
      >
        <MoreVertical className="w-4 h-4 text-slate-600" />
      </button>
    </div>
  );
}
