import { useState, useRef } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, Upload, Hash, AlignLeft } from 'lucide-react';
import { useUploadDocument, useUpdateDocument } from '../hooks/useDocuments';
import { useDocumentCategories } from '../../categories/hooks/useDocumentCategories';
import type { Document } from '../types/document';

interface DocumentUploadProps {
  document?: Document;
  onClose: () => void;
  onUpload?: (data: {
    name: string;
    categoryId: string;
    file: File | null;
    documentNumber?: string;
    description?: string;
    issueDate?: string;
    expiryDate?: string;
    notes?: string;
  }) => void;
  onUpdate?: () => void;
}

const parseDateToYYYYMMDD = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

export function DocumentUpload({ document, onClose, onUpload, onUpdate }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: document?.name || '',
    categoryId: document?.categoryId || '',
    documentNumber: document?.documentNumber || '',
    description: document?.description || '',
    issueDate: parseDateToYYYYMMDD(document?.issueDate),
    expiryDate: parseDateToYYYYMMDD(document?.expiryDate),
    notes: document?.notes || '',
    file: null as File | null,
  });

  const { mutate: uploadMutate, isLoading: isUploading, error: uploadError } = useUploadDocument();
  const { mutate: updateMutate, isLoading: isUpdating, error: updateError } = useUpdateDocument();
  const {
    data: apiCategories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useDocumentCategories();
  const [validationError, setValidationError] = useState<string | null>(null);

  const categories = apiCategories || [];
  const isLoading = isUploading || isUpdating;
  const error = uploadError || updateError;

  const handleDrag = (e: React.DragEvent) => {
    if (isLoading) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isLoading) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setValidationError('You cannot upload files greater than 10 MB.');
        setFormData((prev) => ({
          ...prev,
          file: null,
        }));
        return;
      }
      setFormData((prev) => {
        const nextName = prev.name
          ? prev.name
          : selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
        return {
          ...prev,
          file: selectedFile,
          name: nextName,
        };
      });
      setValidationError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document && !formData.file) {
      setValidationError('Please select a file to upload.');
      return;
    }
    if (formData.file && formData.file.size > 10 * 1024 * 1024) {
      setValidationError('You cannot upload files greater than 10 MB.');
      return;
    }
    setValidationError(null);

    try {
      if (document) {
        const updateData = new FormData();
        updateData.append('name', formData.name);
        updateData.append('categoryId', formData.categoryId);
        if (formData.documentNumber) updateData.append('documentNumber', formData.documentNumber);
        if (formData.description) updateData.append('description', formData.description);
        if (formData.issueDate) updateData.append('issueDate', formData.issueDate);
        if (formData.expiryDate) updateData.append('expiryDate', formData.expiryDate);
        updateData.append('notes', formData.notes || '');
        if (formData.file) {
          updateData.append('file', formData.file);
        }

        await updateMutate({ id: document.id, formData: updateData });
        onUpdate?.();
      } else {
        await uploadMutate({
          name: formData.name,
          categoryId: formData.categoryId,
          file: formData.file!,
          documentNumber: formData.documentNumber || undefined,
          description: formData.description || undefined,
          issueDate: formData.issueDate || undefined,
          expiryDate: formData.expiryDate || undefined,
          notes: formData.notes || undefined,
        });
        onUpload?.(formData);
      }
    } catch {
      // Handled by mutation hook state
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex items-start justify-between p-6 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <UploadCloud className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {document ? 'Update Document' : 'Secure Document Upload'}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {document
                  ? 'Update document metadata or replace file'
                  : 'Add a new file to your VaultSaaS repository'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6">
          {(validationError || error || categoriesError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
              <span className="font-semibold shrink-0">Error:</span>
              <span className="break-all">
                {validationError ||
                  error?.message ||
                  categoriesError?.message ||
                  'Something went wrong.'}
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className={[
                'col-span-2 md:col-span-1 border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                isLoading
                  ? 'opacity-60 cursor-not-allowed border-slate-200 bg-slate-100'
                  : 'cursor-pointer',
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-300 bg-slate-50 hover:border-slate-400',
              ].join(' ')}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                className="hidden"
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const selectedFile = e.target.files[0];
                    if (selectedFile.size > 10 * 1024 * 1024) {
                      setValidationError('You cannot upload files greater than 10 MB.');
                      setFormData((prev) => ({
                        ...prev,
                        file: null,
                      }));
                      return;
                    }
                    setFormData((prev) => {
                      const nextName = prev.name
                        ? prev.name
                        : selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) ||
                          selectedFile.name;
                      return {
                        ...prev,
                        file: selectedFile,
                        name: nextName,
                      };
                    });
                    setValidationError(null);
                  }
                }}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm">
                  <UploadCloud className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {formData.file
                      ? formData.file.name
                      : document
                        ? 'Replace current file'
                        : 'Drag and drop file here'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.file
                      ? `${(formData.file.size / 1024 / 1024).toFixed(2)} MB`
                      : document
                        ? 'or click to replace (optional)'
                        : 'or click to browse from your computer'}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-slate-200">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-600">PDF</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-slate-200">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-600">JPG</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-slate-200">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-600">PNG</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Maximum file size: 10MB. All uploads are end-to-end encrypted.
                </p>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g., 2023 Tax Return"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  required
                  disabled={isLoading || isCategoriesLoading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="">
                    {isCategoriesLoading ? 'Loading categories...' : 'Select category...'}
                  </option>
                  {categories
                    .filter((cat) => cat.id !== 'all' && (cat.id || cat._id) !== 'all')
                    .map((category) => {
                      const catId = category.id || category._id;
                      return (
                        <option key={catId} value={catId}>
                          {category.name}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Document Number <span className="text-slate-400">(Optional)</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g., A12345678"
                    value={formData.documentNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, documentNumber: e.target.value }))
                    }
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description <span className="text-slate-400">(Optional)</span>
                </label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g., International passport"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 items-start">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 whitespace-nowrap">
                    Issue Date <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        issueDate: e.target.value,
                      }))
                    }
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 whitespace-nowrap">
                    Expiry Date <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        expiryDate: e.target.value,
                      }))
                    }
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Notes <span className="text-slate-400">(Optional)</span>
                </label>
                <textarea
                  placeholder="Add any relevant context or tags..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
            <p className="text-xs text-green-700">
              Your documents are encrypted using AES-256 standard and stored securely in VaultSaaS.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : document ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isLoading
                ? document
                  ? 'Updating...'
                  : 'Uploading...'
                : document
                  ? 'Save Changes'
                  : 'Secure Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
