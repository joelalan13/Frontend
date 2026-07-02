const listaPost = [
    {
        idUser:"pepe",
        id:1,
        idPost:1,
        tags:[{
                idTag:1,
                nombre:"Atag1",
                idPost:1
            },
            {
                idTag:2,
                nombre:"Btag2",
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
        ],
        fechaPublicacion:20
    },
        {
        idUser:"Luis",
        id:2,        
        idPost:2,
        tags:[{
                idTag:1,
                nombre:"Atag1",
                idPost:1
            },
            {
                idTag:2,
                nombre:"Btag2",
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
        ],
        fechaPublicacion:19        
    },{
        idUser:"Ramiro",
        idPost:3,
        id:3,        
        tags:[{
                idTag:3,
                nombre:"Ctag3",
                idPost:2
            },
            {
                idTag:4,
                nombre:"Dtag4",
                idPost:2
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
        ],
                fechaPublicacion:18
    },{
        idUser:"pepe",
        idPost:10,
        id:4,        
        tags:[{
                idTag:5,
                nombre:"Etag5",
                idPost:10
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
        ],
        fechaPublicacion:17
    },


]

export default listaPost