import { apiClient } from '../../../../api/client';
import type {
  Document,
  DocumentUploadData,
  DocumentFilters,
  DocumentVersion,
  DocumentType,
  DocumentStatus,
} from '../types/document';

interface BackendFile {
  size?: number;
  extension?: string;
  url?: string;
}

interface BackendCategoryObject {
  _id?: string;
  id?: string;
}

interface BackendDocument {
  _id?: string;
  name?: string;
  categoryName?: string;
  categoryId?: string | BackendCategoryObject;
  createdAt?: string;
  expiryDate?: string;
  file?: BackendFile;
  status?: string;
  notes?: string;
  tags?: string[];
  version?: string;
  isEncrypted?: boolean;
  documentNumber?: string;
  description?: string;
  issueDate?: string;
}

interface BackendDocumentsResponse {
  message: string;
  data:
    | BackendDocument[]
    | {
        data: BackendDocument[];
        total: number;
        page: number;
        limit: number;
      };
}

export const documentService = {
  // Get all documents with optional filters
  getDocuments: async (filters?: DocumentFilters): Promise<Document[]> => {
    const response = await apiClient.get<BackendDocumentsResponse>('/documents', {
      params: filters,
    });

    // Map backend documents to frontend Document type
    const backendDocs = Array.isArray(response.data?.data)
      ? response.data.data
      : response.data?.data?.data || [];
    return backendDocs.map((doc: BackendDocument): Document => {
      const bytes = doc.file?.size || 0;
      let sizeStr = '0 Bytes';
      if (bytes > 0) {
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        sizeStr = parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }

      const uploadedDateStr = doc.createdAt
        ? new Date(doc.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '';

      const expiryDateStr = doc.expiryDate
        ? new Date(doc.expiryDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : undefined;

      // Handle categoryId which might be string or object
      let catId = '';
      if (doc.categoryId) {
        if (typeof doc.categoryId === 'object') {
          catId = doc.categoryId._id || doc.categoryId.id || '';
        } else {
          catId = String(doc.categoryId);
        }
      }

      return {
        id: doc._id || '',
        name: doc.name || '',
        category: doc.categoryName || 'Others',
        categoryId: catId,
        type: (doc.file?.extension?.toUpperCase() || 'OTHER') as DocumentType,
        size: sizeStr,
        sizeBytes: bytes,
        uploadedDate: uploadedDateStr,
        expiryDate: expiryDateStr,
        status: doc.status === 'ACTIVE' ? 'normal' : (doc.status as DocumentStatus) || 'normal',
        url: doc.file?.url || '',
        notes: doc.notes || '',
        tags: doc.tags || [],
        version: doc.version || '1.0',
        isEncrypted: doc.isEncrypted || false,
        documentNumber: doc.documentNumber || '',
        description: doc.description || '',
        issueDate: doc.issueDate ? new Date(doc.issueDate).toISOString().split('T')[0] : undefined,
      };
    });
  },

  // Get a single document by ID
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDocumentById: async (_id: string) => {
    // TODO: Implement API call
    // const response = await apiClient.get<Document>(`/documents/${id}`);
    // return response.data;
    return null as unknown as Document;
  },

  // Upload a new document
  uploadDocument: async (data: DocumentUploadData) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('name', data.name);
    formData.append('categoryId', data.categoryId);
    if (data.documentNumber) formData.append('documentNumber', data.documentNumber);
    if (data.description) formData.append('description', data.description);
    if (data.issueDate) formData.append('issueDate', data.issueDate);
    if (data.expiryDate) formData.append('expiryDate', data.expiryDate);
    if (data.notes) formData.append('notes', data.notes);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));

    const response = await apiClient.post<Document>('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update document metadata
  updateDocument: async (id: string, formData: FormData) => {
    const response = await apiClient.patch<Document>(`/documents/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete a document
  deleteDocument: async (id: string) => {
    await apiClient.delete(`/documents/${id}`);
  },

  // Download a document
  downloadDocument: async (id: string) => {
    const response = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get document versions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDocumentVersions: async (_id: string) => {
    // TODO: Implement API call
    // const response = await apiClient.get<DocumentVersion[]>(
    //   `/documents/${id}/versions`
    // );
    // return response.data;
    return [] as DocumentVersion[];
  },

  // Share document
  shareDocument: async (id: string, emails: string[]) => {
    const response = await apiClient.post(`/documents/${id}/share`, { emails });
    return response.data;
  },
};
