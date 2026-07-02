import { use, useState } from "react"
import {Button, Col, Container, Row, Collapse} from "react-bootstrap"

import ButtonScroll from "../component/ButtonScroll"
import FeedPost from "../component/FeedPost"

import listaPost from "../data/Post"
import "../style/tagExplorer.css"

const Inicio = () =>{
    {/*prueba para id de usuarios que el usuario logueado siga*/}    
    const seguidos = [1,4]
    const [posts,setPosts] = useState(listaPost);


    {/*Use state para el buttonScroll, el cual setea el valor para mostrar un tipo de feed*/}
    const [mostrar,setMostrar] = useState(true);
    {/*dependiendo de como este seteado mostrar, crea una copia con el filtro de seguidos*/}
    const postAMostrar = mostrar == true ? [... posts].sort((a,b) => a.fechaPublicacion - b.fechaPublicacion) : [... posts].filter(p => seguidos.includes(p.id)).sort((a,b) => a.fechaPublicacion - b.fechaPublicacion)
    
    {/*Un array con los name de los tags que esten activados*/}
    
    const [activeTags,setActiveTags] = useState([])
    
    {/*crea un array con los nombres tags de postMostrar y los ordena alfabeticamente, ya que usa el nameTag*/}
    const allTags = Array.from(new Set(postAMostrar.flatMap(p => p.tags?.map(t => t.nombre) ?? []))).sort((a,b) => a.localeCompare(b))
    {/*Devuelve una lista con los post que cumplan con la condicion de tener el tag  */}
    const filterTags = (activeTags.length > 0? postAMostrar.filter(p => p.tags?.some(t => activeTags.includes(t.nombre))) : postAMostrar)

    {/*Contenedor retractil para los tags*/}

    const [open,setOpen] = useState(false)
  
    return(
       <Container fluid="md">
     
            {/*Fila para Busqueda Por Tags */}
            <Row>
                 <button onClick={() =>{setOpen(!open)}} className="collapse-button">
                    <span>{open ? '▲' : '▼'}</span>
                 </button>
                 <Collapse in={open}>
                    <div className="tag-container"> 
                        <Button
                            variant="ligth"
                            className={activeTags.length == 0? "tagExplorer-activo" : "tagExplorer-inactivo" }
                            onClick={() => setActiveTags([])}
                        >
                           Todos
                        </Button>
                        {allTags.map(t => <Button key={t} onClick={
                            () => setActiveTags(prev => prev.includes(t) ? prev.filter(tag => tag !==t) : [... prev,t]) }
                             className={activeTags.includes(t)? "tagExplorer-activo" : "tagExplorer-inactivo" }
                             variant="ligth"
                        >
                            {t}
                        </Button>)}
                       
                    </div>
                 </Collapse>
            </Row>
            {/*Fila para Separar Publicaciones en General/siguiendo */}
            <ButtonScroll setMostrar={setMostrar}/>
            <Col>
                {filterTags?.map(post =>(
                    <FeedPost key={post.idPost} dataPost={post}/>
                    
                ))}
                    
            </Col>
            {console.log(allTags)}
       </Container>
    )

}

export default Inicio