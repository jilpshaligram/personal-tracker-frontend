import { useState, useEffect, useCallback } from 'react';
import { documentService } from '../services/documentService';
import type { DocumentUploadData, DocumentFilters, Document } from '../types/document';

export const useDocuments = (filters?: DocumentFilters) => {
  const [data, setData] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const filterString = JSON.stringify(filters);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentService.getDocuments(filters);
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterString]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchDocuments();
      }
    });
    return () => {
      active = false;
    };
  }, [fetchDocuments]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDocuments,
  };
};

export const useDocument = () => {
  return {
    data: null,
    isLoading: false,
    error: null,
  };
};

export const useUploadDocument = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (
    data: DocumentUploadData,
    onProgress?: (stage: 'uploading' | 'saving', percent?: number) => void
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await documentService.uploadDocument(data, onProgress);
      return response;
    } catch (err) {
      const errorObject = err instanceof Error ? err : new Error(String(err));
      setError(errorObject);
      throw errorObject;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
};

export const useUpdateDocument = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async ({ id, formData }: { id: string; formData: FormData }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await documentService.updateDocument(id, formData);
      return response;
    } catch (err) {
      const errorObject = err instanceof Error ? err : new Error(String(err));
      setError(errorObject);
      throw errorObject;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
};

export const useDeleteDocument = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await documentService.deleteDocument(id);
    } catch (err) {
      const errorObject = err instanceof Error ? err : new Error(String(err));
      setError(errorObject);
      throw errorObject;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
};

export const useDownloadDocument = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await documentService.downloadDocument(id);
      return response;
    } catch (err) {
      const errorObject = err instanceof Error ? err : new Error(String(err));
      setError(errorObject);
      throw errorObject;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
};

export const useDocumentVersions = () => {
  return {
    data: [],
    isLoading: false,
    error: null,
  };
};

export const useShareDocument = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async ({ id, emails }: { id: string; emails: string[] }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await documentService.shareDocument(id, emails);
      return response;
    } catch (err) {
      const errorObject = err instanceof Error ? err : new Error(String(err));
      setError(errorObject);
      throw errorObject;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
};
