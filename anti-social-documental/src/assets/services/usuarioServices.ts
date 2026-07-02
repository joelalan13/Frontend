import type { User, RegisterPayload } from "../../types";
import noFindError from "./noFindError"

const API_URL = "http://localhost:8080"

const getUsuarios = async (): Promise<User[]> => {
    const respuesta = await fetch(`${API_URL}/usuarios`)

    noFindError(respuesta)

    const usuarios: User[] = await respuesta.json()

    return usuarios;
}

const getUsuarioById = async (idUsuario: string): Promise<User> => {
    const respuesta = await fetch(`${API_URL}/usuario/${idUsuario}`)

    noFindError(respuesta)

    const usuario : User = await respuesta.json()

    return usuario;
}

const postUsuario = async (payload: RegisterPayload): Promise<User> => {

    const respuesta = await fetch(`${API_URL}/usuario`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)  // Sin las llaves extra
    });

    noFindError(respuesta)

    const nuevoUser: User = await respuesta.json();

    return nuevoUser;
};

const putUsuario = async (payload: RegisterPayload, idUsuario : string) : Promise <User> =>{

    const respuesta = await fetch(`${API_URL}/usuario/${idUsuario}`, {
        method : "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    noFindError(respuesta)

    const data = await respuesta.json()
    
    return data
}

const getUserProfileById = async (idUsuario: string): Promise<User> => {
    const respuesta = await fetch(`${API_URL}/usuario/${idUsuario}/profile`)

    noFindError(respuesta)

    return respuesta.json()
}

const followUser = async (idFollower: string, idFollowing: string): Promise<any> => {
    const respuesta = await fetch(`${API_URL}/usuario/${idFollower}/follow/${idFollowing}`, {
        method: 'POST'
    })

    noFindError(respuesta)

    if (respuesta.status === 204 || respuesta.headers.get('content-length') === '0') {
        return null
    }

    return respuesta.json()
}

const unfollowUser = async (idFollower: string, idFollowing: string): Promise<any> => {
    const respuesta = await fetch(`${API_URL}/usuario/${idFollower}/unfollow/${idFollowing}`, {
        method: 'POST'
    })

    noFindError(respuesta)

    if (respuesta.status === 204 || respuesta.headers.get('content-length') === '0') {
        return null
    }

    return respuesta.json()
}

const deleteUsuario = async (idUsuario: string) : Promise <void> => {

    const respuesta = await fetch(`${API_URL}/usuario/${idUsuario}`, {
        method: "DELETE",
    })
    
    noFindError(respuesta)   
}

export default { getUsuarios, getUsuarioById, postUsuario, putUsuario, getUserProfileById, followUser, unfollowUser, deleteUsuario }