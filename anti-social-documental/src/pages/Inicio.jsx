import { useState } from "react"
import { Row, Col, Container, Card} from "react-bootstrap"
import {NavLink, Link} from "react-router-dom"

import ButtonScroll from "../component/ButtonScroll"
import FeedPost from "../component/FeedPost"

import listaPost from "../data/Post"

const Inicio = () =>{
    const [activo,setActivo] = useState(true)
    return(
       <Container fluid ="md">
            {/*Fila para Separar Publicaciones en General/siguiendo */}
            <Row>

                <ButtonScroll/>
            
            </Row>
            
            {/*Fila para Busqueda Por Tags */}
            <Row>
            
                <Col>
                    {listaPost.map(post =>(
                        <FeedPost key={post.idPost} dataPost={post}/>
                    ))}
                    
                </Col>

            </Row>

       </Container>
    )
}

export default Inicio