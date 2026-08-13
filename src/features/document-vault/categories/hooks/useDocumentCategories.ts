import { useState, useEffect } from 'react';
import { documentCategoryService } from '../services/documentCategoryService';
import type { DocumentCategory } from '../types/documentCategory';
import type {
  DocumentCategoryCreateData,
  DocumentCategoryUpdateData,
} from '../types/documentCategory';

export const useDocumentCategories = () => {
  const [data, setData] = useState<DocumentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [categoriesData, countsData] = await Promise.all([
        documentCategoryService.getCategories(),
        documentCategoryService.getCategoryCounts(),
      ]);

      const countMap = new Map<string, number>();
      countsData.forEach((c) => {
        countMap.set(c.categoryId, c.count);
      });

      const mappedData = categoriesData.map((cat) => {
        const catId = cat.id || cat._id || '';
        return {
          ...cat,
          count: countMap.get(catId) || 0,
        };
      });

      setData(mappedData);
      return mappedData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchCategories,
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useDocumentCategory = (_id: string) => {
  return {
    data: null,
    isLoading: false,
    error: null,
  };
};

export const useCreateDocumentCategory = () => {
  return {
    mutate: (data: DocumentCategoryCreateData) => {
      return documentCategoryService.createCategory(data);
    },
    isLoading: false,
    error: null,
  };
};

export const useUpdateDocumentCategory = () => {
  return {
    mutate: (data: DocumentCategoryUpdateData) => {
      return documentCategoryService.updateCategory(data);
    },
    isLoading: false,
    error: null,
  };
};

export const useDeleteDocumentCategory = () => {
  return {
    mutate: (id: string) => {
      return documentCategoryService.deleteCategory(id);
    },
    isLoading: false,
    error: null,
  };
};
