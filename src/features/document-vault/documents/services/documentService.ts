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
  getDocuments: async (filters?: DocumentFilters): Promise<Document[]> => {
    const response = await apiClient.get<BackendDocumentsResponse>('/documents', {
      params: filters,
    });

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

  getDocumentById: async (_id: string) => {
    void _id;
    return null as unknown as Document;
  },

  getUploadSignature: async (
    categoryId: string
  ): Promise<{
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder: string;
  }> => {
    const response = await apiClient.post<{
      success: boolean;
      data: {
        signature: string;
        timestamp: number;
        apiKey: string;
        cloudName: string;
        folder: string;
      };
    }>('/documents/upload-signature', { categoryId });
    return response.data.data;
  },

  uploadToCloudinaryDirect: async (
    file: File,
    signatureData: {
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
      folder: string;
    },
    onProgress?: (percent: number) => void
  ): Promise<{
    url: string;
    publicId: string;
    originalName: string;
    mimeType: string;
    extension: string;
    size: number;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.apiKey);
    formData.append('timestamp', String(signatureData.timestamp));
    formData.append('signature', signatureData.signature);
    formData.append('folder', signatureData.folder);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', cloudinaryUrl);

      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const result = JSON.parse(xhr.responseText) as {
            secure_url: string;
            public_id: string;
            original_filename: string;
            format: string;
            bytes: number;
            resource_type: string;
          };
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            originalName: file.name,
            mimeType: file.type,
            extension: result.format || file.name.split('.').pop() || '',
            size: result.bytes,
          });
        } else {
          reject(new Error(`Cloudinary upload failed: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during Cloudinary upload.'));
      xhr.send(formData);
    });
  },

  uploadDocument: async (
    data: DocumentUploadData,
    onProgress?: (stage: 'uploading' | 'saving', percent?: number) => void
  ) => {
    const signatureData = await documentService.getUploadSignature(data.categoryId);

    onProgress?.('uploading', 0);
    const cloudinaryData = await documentService.uploadToCloudinaryDirect(
      data.file,
      signatureData,
      (percent) => onProgress?.('uploading', percent)
    );
    onProgress?.('saving');

    const response = await apiClient.post<Document>('/documents', {
      name: data.name,
      categoryId: data.categoryId,
      cloudinaryData,
      ...(data.documentNumber && { documentNumber: data.documentNumber }),
      ...(data.description && { description: data.description }),
      ...(data.issueDate && { issueDate: data.issueDate }),
      ...(data.expiryDate && { expiryDate: data.expiryDate }),
      ...(data.notes && { notes: data.notes }),
      ...(data.tags && { tags: data.tags }),
    });
    return response.data;
  },

  updateDocument: async (id: string, formData: FormData) => {
    const response = await apiClient.patch<Document>(`/documents/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteDocument: async (id: string) => {
    await apiClient.delete(`/documents/${id}`);
  },

  downloadDocument: async (id: string) => {
    const response = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getDocumentVersions: async (_id: string) => {
    void _id;
    return [] as DocumentVersion[];
  },

  shareDocument: async (id: string, emails: string[]) => {
    const response = await apiClient.post(`/documents/${id}/share`, { emails });
    return response.data;
  },
};
