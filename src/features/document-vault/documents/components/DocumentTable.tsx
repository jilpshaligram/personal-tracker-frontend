import { FileText, MoreVertical } from 'lucide-react';
import type { Document } from '../types/document';

interface DocumentTableProps {
  documents: Document[];
  onDocumentClick: (document: Document) => void;
}

export function DocumentTable({ documents, onDocumentClick }: DocumentTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Size
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Uploaded
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {documents.map((document) => (
            <tr
              key={document.id}
              className="hover:bg-slate-50 cursor-pointer"
              onClick={() => onDocumentClick(document)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded">
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{document.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                  {document.category}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">{document.type}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{document.size}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{document.uploadedDate}</td>
              <td className="px-4 py-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle more actions
                  }}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
