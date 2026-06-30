const listaPost = [
    {
        idUser:"pepe",
        idPost:1,
        tags:[{
                idTag:1,
                nombre:"PERSISTENCIA",
                idPost:1
            },
            {
                idTag:2,
                nombre:"INTERFACES",
                idPost:1
            }],
        nombre:"Esteban Quito",
        url:"https://via.placeholder.com/800x500?text=Post+1",
        images:[
            "https://thumbs.dreamstime.com/b/primer-de-un-perrito-malt%C3%A9s-aislado-en-fondo-gris-37142759.jpg",
            "https://i.pinimg.com/736x/28/83/3b/28833bc9fa38758c67f185c2e867858c.jpg"
        ],
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
        url:"https://via.placeholder.com/800x500?text=Post+2",
        images:[
            "https://i.pinimg.com/originals/b0/69/be/b069be6858a2267ea3e5bf7c005b9aea.jpg",
            "https://static.vecteezy.com/system/resources/thumbnails/074/518/508/small/a-cute-golden-retriever-puppy-raises-its-paw-and-smiles-with-its-tongue-out-on-a-clean-white-background-photo.jpg",            
            "https://img.magnific.com/foto-gratis/cachorros-beagle-estan-buscando-algo_1150-18193.jpg?semt=ais_hybrid&w=740&q=80",
            "https://content.elmueble.com/medio/2023/05/25/cachorro-de-bichon-maltes_61209cca_230525143331_1000x1500.jpg",
        ],
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