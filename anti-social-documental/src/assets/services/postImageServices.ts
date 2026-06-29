import type { PostImage, CreatePostImagePayload, Post } from "../../types";
import noFindError from "./noFindError"

const API_URL = "http://localhost:8080"

const getImagesDePost = async(idPost: string) : Promise<PostImage[]> => {

    const respuesta = await fetch(`${API_URL}/post/${idPost}/images`)

    noFindError(respuesta)

    const data : PostImage[] = await respuesta.json()

    return data

}

const getImageDePostById = async (idPost: string , idImage : string) : Promise<PostImage> =>{

    const respuesta = await fetch(`${API_URL}/post/${idPost}/images/${idImage}`)

    noFindError(respuesta)

    const data : PostImage = await respuesta.json()

    return data
}

const postImage = async ( payload: CreatePostImagePayload ,idPost: string) : Promise<PostImage[]> => {

    const respuesta = await fetch(`${API_URL}/post/${idPost}/images`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(payload)
    })

    noFindError(respuesta)

    const nuevasImagenes : PostImage[] = await respuesta.json()


    return nuevasImagenes
}

const putImage = async (payload: CreatePostImagePayload, idPost : string, idImage: string) : Promise<PostImage> => {

    const respuesta = await fetch(`${API_URL}/post/${idPost}/image/${idImage}`, {
        method : "PUT",
        headers : {
             'Content-Type': 'application/json'
        },
        body : JSON.stringify(payload)
    })

    noFindError(respuesta)

    const data : PostImage = await respuesta.json()

    return data
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