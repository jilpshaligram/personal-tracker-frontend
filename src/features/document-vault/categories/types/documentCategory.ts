export type DocumentCategoryStatus = 'ACTIVE' | 'INACTIVE';

export interface DocumentCategory {
  id: string;
  _id?: string;
  name: string;
  status: DocumentCategoryStatus;
  createdAt: string;
  updatedAt: string;
  count?: number;
}

export interface DocumentCategoryCreateData {
  name: string;
}

export interface DocumentCategoryUpdateData {
  _id: string;
  name?: string;
  status?: DocumentCategoryStatus;
}

export interface DocumentCategoryQuery {
  status?: DocumentCategoryStatus;
  page?: number;
  limit?: number;
  sortOrder?: 'asc' | 'desc';
}
