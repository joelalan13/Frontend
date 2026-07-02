export interface User {
  _id?: string
  idUser?: string
  nickName: string
  nombre: string
  apellido: string
  fotoPerfil?: string
  followers?: any[]
  following?: any[]
  createdAt?: Date
  updatedAt?: Date
}

export interface PostImage {
  _id?: string
  idPostImage?: string
  url: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Post {
  _id?: string
  idPost?: string
  idUser: string
  descripcion: string
  images?: PostImage[]
  tags?: string[]
  Comments?: Comment[]
  likes?: number
  likedBy?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Comment {
  _id?: string
  idComment?: string
  idPost: string
  idUser: string
  contenido: string
  visible?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Tag {
  _id?: string
  nombre: string
  idTag?: number
}

export interface RegisterPayload {
  nickName: string
  nombre: string
  apellido: string
}

export interface CreatePostPayload {
  idUser: string
  descripcion: string
}

export interface LikeResponse {
  likes: number
  liked: boolean
  likedBy: string[]
}

export interface CreateCommentPayload {
  idUser: string
  contenido: string
}

export interface CreatePostImagePayload {
  urlImages: string[]
}

export interface TagPaginatedResponse {
  data: Tag[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
