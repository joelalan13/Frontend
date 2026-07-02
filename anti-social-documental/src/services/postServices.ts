import type { Post, CreatePostPayload, LikeResponse } from "../types"
import noFindError from "./noFindError"
import { API_URL } from "../constants"

const getPosts = async (): Promise<Post[]> => {
  const respuesta = await fetch(`${API_URL}/posts`)
  noFindError(respuesta)
  const data: Post[] = await respuesta.json()
  return data
}

const getPostById = async (idPost: string): Promise<Post> => {
  const respuesta = await fetch(`${API_URL}/post/${idPost}`)
  noFindError(respuesta)
  const data: Post = await respuesta.json()
  return data
}

const postPost = async (payload: CreatePostPayload): Promise<Post> => {
  const respuesta = await fetch(`${API_URL}/post`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  noFindError(respuesta)
  const nuevoPost: Post = await respuesta.json()
  return nuevoPost
}

const putPost = async (payload: CreatePostPayload, idPost: string): Promise<Post> => {
  const respuesta = await fetch(`${API_URL}/post/${idPost}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  noFindError(respuesta)
  const data: Post = await respuesta.json()
  return data
}

const deletePost = async (idPost: string): Promise<void> => {
  const respuesta = await fetch(`${API_URL}/post/${idPost}`, {
    method: "DELETE",
  })
  noFindError(respuesta)
}

const addLike = async (idPost: string, idUser: string): Promise<LikeResponse> => {
  const respuesta = await fetch(`${API_URL}/post/${idPost}/like/${idUser}`, {
    method: "POST",
  })
  noFindError(respuesta)
  return respuesta.json()
}

const removeLike = async (idPost: string, idUser: string): Promise<LikeResponse> => {
  const respuesta = await fetch(`${API_URL}/post/${idPost}/like/${idUser}`, {
    method: "DELETE",
  })
  noFindError(respuesta)
  return respuesta.json()
}

export default { getPostById, getPosts, putPost, postPost, deletePost, addLike, removeLike }
