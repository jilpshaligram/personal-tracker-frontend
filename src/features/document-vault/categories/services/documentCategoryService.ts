import { apiClient } from '../../../../api/client'; 
import type {
  DocumentCategory,
  DocumentCategoryCreateData,
  DocumentCategoryQuery,
  DocumentCategoryUpdateData,
} from '../types/documentCategory';

export const documentCategoryService = {
  getCategories: async (params?: DocumentCategoryQuery) => {
    const response = await apiClient.get<DocumentCategory[]>(
      '/document-categories',
      {
        params,
      }
    );
    return response.data;
  },

  getCategoryById: async (id: string) => {
    const response = await apiClient.get<DocumentCategory>(
      `/document-categories/${id}`
    );
    return response.data;
  },

 
  createCategory: async (data: DocumentCategoryCreateData) => {
    const response = await apiClient.post<DocumentCategory>(
      '/document-categories',
      data
    );
    return response.data;
  },


  updateCategory: async (data: DocumentCategoryUpdateData) => {
    const { _id, ...updateData } = data;
    const response = await apiClient.put<DocumentCategory>(
      `/document-categories/${_id}`,
      updateData
    );
    return response.data;
  },


  deleteCategory: async (id: string) => {
    await apiClient.delete(`/document-categories/${id}`);
  },

  getCategoryCounts: async () => {
    const response = await apiClient.get<{
      success: boolean;
      data: Array<{ categoryId: string; categoryName: string; count: number }>;
    }>('/documents/count-by-category');
    return response.data.data;
  },
};
