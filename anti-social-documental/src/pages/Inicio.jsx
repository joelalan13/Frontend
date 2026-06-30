import { use, useState } from "react"
import {Button, Col, Container, Row, Collapse} from "react-bootstrap"

import ButtonScroll from "../component/ButtonScroll"
import FeedPost from "../component/FeedPost"

import listaPost from "../data/Post"

const Inicio = () =>{
    const [posts,setPosts] = useState(listaPost);
    {/*const postOrdenadosPorFecha = [... posts] . sort ((a,b) => b.fechaPublicacion - a.fechaPublicacion);*/}
    
    {/*Un array con los name de los tags que esten activados*/}
    const [activeTags,setActiveTags] = useState([])
    {/*crea un array con los nombres tags de las publicaciones que esten en [posts,---]*/}
    const allTags = Array.from(new Set(posts.flatMap(p => p.tags?.map(t => t.nombre) ?? [])))
    {/*Devuelve una lista con los post que cumplan con la condicion de tener el tag  */}
    const filterTags = activeTags.length > 0? posts.filter(p => p.tags?.some(t => activeTags.includes(t.nombre))) : posts

    {/*Contenedor retractil para los tags*/}

    const [open,setOpen] = useState(false)
    console.log(filterTags)
    return(
       <Container fluid="md">
     
            {/*Fila para Busqueda Por Tags */}
            <Row style={{border:"gray 1px solid"}}>
                 <button onClick={() =>{setOpen(!open)}}>
                    <span>{open ? '▲' : '▼'}</span>
                 </button>
                 <Collapse in={open}>
                    <div> 
                        <Button
                            variant={activeTags.length === 0? "primary" : "outline-primary"}
                            onClick={() => setActiveTags([])}
                        >
                           Todos
                        </Button>
                        {allTags.map(t => <Button key={t} onClick={() => setActiveTags(prev => prev.includes(t) ? prev.filter(tag => tag !==t) : [... prev,t]) } variant={activeTags.includes(t) ? "primary" : "outline-primary"}>
                            {t}
                        </Button>)}
                       
                    </div>
                 </Collapse>
            </Row>
            {/*Fila para Separar Publicaciones en General/siguiendo */}
            <Col>
                {filterTags?.map(post =>(
                    <FeedPost key={post.idPost} dataPost={post}/>
                    
                ))}
                    
            </Col>
       </Container>
    )

}

export default Inicio