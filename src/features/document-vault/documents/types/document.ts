export interface Document {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  type: DocumentType;
  size: string;
  sizeBytes: number;
  uploadedDate: string;
  modifiedDate?: string;
  expiryDate?: string;
  status: DocumentStatus;
  thumbnail?: string;
  url?: string;
  notes?: string;
  tags?: string[];
  version: string;
  isEncrypted: boolean;
  documentNumber?: string;
  description?: string;
  issueDate?: string;
}

export type DocumentType = 'PDF' | 'DOCX' | 'XLSX' | 'JPEG' | 'PNG' | 'OTHER';

export type DocumentStatus = 'expiring' | 'verified' | 'normal' | 'expired';

export interface DocumentVersion {
  id: string;
  version: string;
  documentId: string;
  uploadedDate: string;
  uploadedBy: string;
  notes: string;
  isCurrent: boolean;
}

export interface DocumentUploadData {
  name: string;
  categoryId: string;
  file: File;
  documentNumber?: string;
  description?: string;
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
  tags?: string[];
}

export interface DocumentFilters {
  categoryId?: string;
  search?: string;
  status?: DocumentStatus;
  type?: DocumentType;
  dateFrom?: string;
  dateTo?: string;
}

export type DocumentViewMode = 'grid' | 'list';
