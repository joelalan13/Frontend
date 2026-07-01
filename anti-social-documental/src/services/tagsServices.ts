import noFindError from "./noFindError"
import type { Tag, TagPaginatedResponse } from "../types"

const API_URL = "http://localhost:8080"

const getAllTags = async (page: number = 1, limit: number = 20, nombre?: string): Promise<TagPaginatedResponse> => {   

    let url = `${API_URL}/tags?page=${page}&limit=${limit}`    
    
    if (nombre) {
        url += `&nombre=${encodeURIComponent(nombre)}`
    }      
    const respuesta = await fetch(url)    

    noFindError(respuesta)
        
    const data: TagPaginatedResponse = await respuesta.json()
    
    return data
}

const getTagsDePostById = async (idPost: string): Promise<string[]> => {
    
    const respuesta = await fetch(`${API_URL}/post/${idPost}/tags`)
    
    noFindError(respuesta)
    
    const data: string[] = await respuesta.json()
    
    return data
}

const addTagToPost = async (idPost: string, tagName: string): Promise<{ message: string; tag: { nombre: string } }> => {
    
    const respuesta = await fetch(`${API_URL}/post/${idPost}/tag`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tagName })
    })
    
    noFindError(respuesta)
    
    const data: { message: string; tag: { nombre: string } } = await respuesta.json()
    
    return data
}

const removeTagFromPost = async (idPost: string, tagName: string): Promise<{ message: string }> => {
    
    const respuesta = await fetch(`${API_URL}/post/${idPost}/tag/${tagName}`, {
        method: "DELETE",
    })
    
    noFindError(respuesta)
    
    const data: { message: string } = await respuesta.json()
    
    return data
}

export default { getAllTags, getTagsDePostById, addTagToPost, removeTagFromPost }
