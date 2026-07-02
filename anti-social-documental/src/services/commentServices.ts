import type { Comment, CreateCommentPayload } from "../types";
import { API_URL } from "../config/api"
import noFindError from "./noFindError"

const getComentariosDePost = async(idPost: string) : Promise<Comment[]> => {

    const respuesta = await fetch(`${API_URL}/post/${idPost}/comments`)

    noFindError(respuesta)

    const data : Comment[] = await respuesta.json()

    return data
}

const postCommentario = async (payload : CreateCommentPayload, idPost: string) : Promise <Comment> =>{

    const respuesta = await fetch (`${API_URL}/post/${idPost}/comment`, {
        method : "POST",
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    noFindError(respuesta)

    const nuevoComentario : Comment = await respuesta.json()

    return nuevoComentario
}

const putComentario = async (contenido: string, idPost : string, idComentario : string) : Promise<Comment> =>{
    const respuesta = await fetch(`${API_URL}/post/${idPost}/comment/${idComentario}`, {
        method : "PUT",
        headers : {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({ contenido })
    })

    noFindError(respuesta)

    const data : Comment = await respuesta.json()

    return data
}

const deleteComentario = async (idPost: string, idComentario : string) : Promise<void> => {
    const respuesta = await fetch (`${API_URL}/post/${idPost}/comment/${idComentario}`,{
        method : "DELETE",
    })

    noFindError(respuesta)
}

export default {getComentariosDePost, postCommentario, putComentario, deleteComentario}
