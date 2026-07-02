export interface User {
  idUser: string;      // ObjectId de MongoDB
  nickName: string;
  nombre: string;
  apellido: string;
  fotoPerfil?: string | null;
  followers: Array<string | UserReference>;
  following: Array<string | UserReference>;
  createdAt: string;
  updatedAt: string;
}

export interface UserReference {
  idUser: string;
  nickName: string;
}

export interface PostImage {
  idPostImage: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  idPost: string;
  idUser: string;
  descripcion: string;
  images: PostImage[];
  tags: string[];
  Comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  idComment: string;
  idPost: string;
  idUser: string;
  contenido: string;
  visible?: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface ApiMessage {
  message: string;
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

