export interface Document {
  _id: string;
  title: string;
  content: string;
  owner: string;
  isFavorite?: boolean; // ← ADD THIS
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;      // ← ADD THIS
  deletedAt?: string; 
}


export interface CreateDocumentInput {
  title: string;
  content?: string;
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
}
