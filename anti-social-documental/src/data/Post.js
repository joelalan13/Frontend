const listaPost = [
    {
        idUser:"pepe",
        idPost:1,
        tags:[{
                idTag:1,
                nombre:"tag1",
                idPost:1
            },
            {
                idTag:2,
                nombre:"tag2",
                idPost:1
            }],
        nombre:"post",
        url:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop&auto=format",
        info:"publicacion de prueba",
        likes:10,
        comentarios:[
            {
                idUser:1,
                idComentario:1,
                contenido:"este comentario es el primero de prueba"
            }
        ]
    },
        {
        idUser:"pepe",
        idPost:2,
        tags:[{
                idTag:1,
                nombre:"tag1",
                idPost:1
            },
            {
                idTag:2,
                nombre:"tag2",
                idPost:1
            }],
        nombre:"post",
        url:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop&auto=format",
        info:"publicacion de prueba",
        likes:9,
        comentarios:[
            {
                idUser:"Luis",
                idComentario:1,
                contenido:"este comentario es el primero de prueba"
            },
            {
                idUser:"Pepe",
                idComentario:2,
                contenido:"este comentario es el primero de prueba"
            }
        ]
    },


]

export default listaPost