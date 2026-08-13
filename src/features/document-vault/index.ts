export * from './documents/components';
export * from './documents/hooks/useDocuments';
export * from './documents/services/documentService';
export type {
  Document,
  DocumentType,
  DocumentStatus,
  DocumentVersion,
  DocumentUploadData,
  DocumentFilters,
  DocumentViewMode,
} from './documents/types/document';

export * from './categories/components';
export * from './categories/hooks/useDocumentCategories';
export * from './categories/services/documentCategoryService';
export type {
  DocumentCategory,
  DocumentCategoryCreateData,
  DocumentCategoryUpdateData,
} from './categories/types/documentCategory';
