export interface User {
  idUser: string;      // ObjectId de MongoDB
  nickName: string;
  nombre: string;
  apellido: string;
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostImage {
  idPostImage: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  idPost: string;
  idUser: string;
  descripcion: string;
  images: PostImage[];
  tags: string[];
  Comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  idComment: string;
  idPost: string;
  idUser: string;
  contenido: string;
  visible?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  nombre: string;
}

export interface RegisterPayload {
  nickName: string;
  nombre: string;
  apellido: string;
}

export interface CreatePostPayload {
  idUser: string;
  descripcion: string;
}

export interface CreateCommentPayload {
  idUser: string;
  contenido: string;
}

export interface CreatePostImagePayload {
  urlImages: string[];
}

export interface TagPaginatedResponse {
  data: Tag[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

