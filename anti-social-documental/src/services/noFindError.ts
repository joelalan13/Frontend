const noFindError = (respuesta  : Response) : Error | void => {
    if(!respuesta.ok){
        throw new Error (`Error en solicitud: ${respuesta.statusText}`)
    }
    
}

export default noFindError