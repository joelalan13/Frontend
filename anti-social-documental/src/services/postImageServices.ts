import type { PostImage, CreatePostImagePayload, ApiMessage } from "../types";
import { API_URL } from "../config/api"
import noFindError from "./noFindError"

const getImagesDePost = async(idPost: string) : Promise<PostImage[]> => {

    const respuesta = await fetch(`${API_URL}/post/${idPost}/images`)

    noFindError(respuesta)

    const data : PostImage[] = await respuesta.json()

    return data

}

const getImageDePostById = async (idPost: string , idImage : string) : Promise<PostImage> =>{

    const respuesta = await fetch(`${API_URL}/post/${idPost}/image/${idImage}`)

    noFindError(respuesta)

    const data : PostImage = await respuesta.json()

    return data
}

const postImage = async ( payload: CreatePostImagePayload ,idPost: string) : Promise<ApiMessage> => {

    const respuesta = await fetch(`${API_URL}/post/${idPost}/images`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(payload)
    })

    noFindError(respuesta)

    return respuesta.json()
}

const putImage = async (payload: CreatePostImagePayload, idPost : string, idImage: string) : Promise<ApiMessage> => {

    const respuesta = await fetch(`${API_URL}/post/${idPost}/image/${idImage}`, {
        method : "PUT",
        headers : {
             'Content-Type': 'application/json'
        },
        body : JSON.stringify(payload)
    })

    noFindError(respuesta)

    return respuesta.json()
}

const deleteImageDePost = async (idPost : string , idImage : string) : Promise<void> => {
    const respuesta = await fetch(`${API_URL}/post/${idPost}/image/${idImage}`,{
        method : "DELETE",
    })

    noFindError(respuesta)
}

const deleteTodasImagesDePost = async (idPost : string) : Promise<void> =>{
    const respuesta = await fetch(`${API_URL}/post/${idPost}/images`, {
        method : "DELETE",
    })

    noFindError(respuesta)
}

export default { getImageDePostById, getImagesDePost, postImage, putImage, deleteImageDePost, deleteTodasImagesDePost}
