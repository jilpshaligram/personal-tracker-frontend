import { useState } from 'react';
import { DocumentCategoryList } from '../features/document-vault/categories/components/DocumentCategoryList';
import { DocumentCard } from '../features/document-vault/documents/components/DocumentCard';
import { DocumentTable } from '../features/document-vault/documents/components/DocumentTable';
import { DocumentFilters } from '../features/document-vault/documents/components/DocumentFilters';
import { DocumentUpload } from '../features/document-vault/documents/components/DocumentUpload';
import { DocumentDetails } from '../features/document-vault/documents/components/DocumentDetails';
import type {
  Document,
  DocumentViewMode,
} from '../features/document-vault/documents/types/document';
import {
  useDocuments,
  useShareDocument,
  useDownloadDocument,
  useDeleteDocument,
} from '../features/document-vault/documents/hooks/useDocuments';
import { useDocumentCategories } from '../features/document-vault/categories/hooks/useDocumentCategories';

export default function DocumentVault() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [viewMode, setViewMode] = useState<DocumentViewMode>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: documents,
    isLoading,
    error: documentsError,
    refetch,
  } = useDocuments({
    categoryId: selectedCategoryId !== 'all' ? selectedCategoryId : undefined,
  });

  const { data: apiCategories, refetch: refetchCategories } = useDocumentCategories();
  const selectedCategory = apiCategories?.find((cat) => (cat._id || cat.id) === selectedCategoryId);
  const selectedCategoryName = selectedCategory?.name;

  const filteredDocuments = (documents || []).filter((doc) => {
    const matchesCategory =
      selectedCategoryId === 'all' ||
      doc.categoryId === selectedCategoryId ||
      (selectedCategoryName && doc.category.toLowerCase() === selectedCategoryName.toLowerCase());
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setShowDocumentDetails(true);
  };

  const handleUpload = () => {
    refetch();
    refetchCategories?.();
    setShowUploadModal(false);
  };

  const { mutate: shareDocument } = useShareDocument();
  const { mutate: downloadDocument } = useDownloadDocument();
  const { mutate: deleteDocument } = useDeleteDocument();

  const handleDownload = async (id: string) => {
    try {
      const blob = await downloadDocument(id);
      const doc = documents.find((d) => d.id === id);
      const fileName = doc ? doc.name + (doc.type ? `.${doc.type.toLowerCase()}` : '') : 'download';

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch {
      const doc = documents.find((d) => d.id === id);
      if (doc && doc.url) {
        window.open(doc.url, '_blank');
      }
    }
  };

  const handleShare = async (id: string) => {
    const emailInput = window.prompt(
      'Enter email addresses to share this document with (separated by commas):'
    );
    if (!emailInput) return;

    const emails = emailInput
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);
    if (emails.length === 0) return;

    try {
      await shareDocument({ id, emails });
      alert('Document shared successfully!');
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to share document: ${errMsg}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this document? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await deleteDocument(id);
      setShowDocumentDetails(false);
      setSelectedDocument(null);
      refetch();
      refetchCategories?.();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to delete document: ${errMsg}`);
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      <DocumentCategoryList
        categories={apiCategories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DocumentFilters
          searchQuery={searchQuery}
          viewMode={viewMode}
          onSearchChange={setSearchQuery}
          onViewModeChange={setViewMode}
          onUploadClick={() => setShowUploadModal(true)}
        />

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : documentsError ? (
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-red-500">Error loading documents: {documentsError.message}</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500">No documents found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments.map((doc) => (
                <DocumentCard key={doc.id} document={doc} onClick={handleDocumentClick} />
              ))}
            </div>
          ) : (
            <DocumentTable documents={filteredDocuments} onDocumentClick={handleDocumentClick} />
          )}
        </div>
      </div>

      {showUploadModal && (
        <DocumentUpload onClose={() => setShowUploadModal(false)} onUpload={handleUpload} />
      )}

      {showDocumentDetails && selectedDocument && (
        <DocumentDetails
          document={selectedDocument}
          onClose={() => {
            setShowDocumentDetails(false);
            setSelectedDocument(null);
          }}
          onDownload={handleDownload}
          onShare={handleShare}
          onDelete={handleDelete}
          onEdit={() => setShowEditModal(true)}
        />
      )}

      {showEditModal && selectedDocument && (
        <DocumentUpload
          document={selectedDocument}
          onClose={() => setShowEditModal(false)}
          onUpdate={async () => {
            setShowEditModal(false);
            const updatedDocs = await refetch();
            refetchCategories?.();
            if (updatedDocs) {
              const updatedDoc = updatedDocs.find((d: Document) => d.id === selectedDocument.id);
              if (updatedDoc) {
                setSelectedDocument(updatedDoc);
              }
            }
          }}
        />
      )}
    </div>
  );
}
