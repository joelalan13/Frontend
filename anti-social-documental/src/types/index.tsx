export interface User {
  _id?: string
  idUser?: string
  nickName: string
  nombre: string
  apellido: string
  fotoPerfil?: string
  followers?: any[]
  following?: any[]
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface PostImage {
  _id?: string
  idPostImage?: string
  url: string
  createdAt?: string | Date
  updatedAt?: string | Date
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
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface Comment {
  _id?: string
  idComment?: string
  idPost: string
  idUser: string | {
    _id?: string
    nickName?: string
    nickname?: string
    userName?: string
    nombre?: string
    apellido?: string
  }
  contenido: string
  nickName?: string
  usuario?: {
    nickName?: string
    nombre?: string
    apellido?: string
  }
  visible?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
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
