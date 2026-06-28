import { useState } from "react"
import {Badge, Button, Card, Row,Col,Nav} from "react-bootstrap"
import {NavLink, Link} from "react-router-dom"

{/*Este es el Component de los Posts que van a aparecer en el inicio o feed */}
const FeedPost = ({dataPost}) =>{
    {/*setea los megustas del post con su info*/}
    const [likes, setLikes] = useState(dataPost.likes);
    
    {/* Empieza en falso(noClickeo)*/}
    
    const [yaClickeado, setYaClickeado] = useState(false);
    
    {/*y cuando haga OnClick suma 1 o resta en caso contrario de que haya dado Click  */}
    
    const handleClick = () => {
        !yaClickeado ? setLikes(prev => prev + 1): setLikes(prev => prev - 1);
        setYaClickeado(!yaClickeado);
    };

    const cantComentarios = dataPost.comentarios?.length || 0

    return(
        <Card className="mt-3">
            {/*Cabecera del post que tendra el userName*/}
            
            <Card.Header>
                {dataPost.nombre}
            </Card.Header>
            <Card.Body>
                {/*Tags del post */}
            
                <div className="mb-2">
                    {dataPost.tags.map(tag =>(
                        <Badge bg="primary" key={tag.idTag}>{tag.nombre}</Badge>
                    ))}
                </div>
            
                <Card.Img variant="top" src={dataPost.url} className="w-100"/>
                {/*Descripcion de Post*/}
                <Card.Text className="mt-3">
                    {dataPost.info}
                </Card.Text>
                
                {/*Botones*/}

                <Row className="mt-3">
                    <Col xs={4} onClick={handleClick} style={{backgroundColor:"gray"}}>
                         Me gustas {likes}
                    </Col>
                    <Col xs={4} as={NavLink} to={`/postDetails/${dataPost.idPost}`}>
                        {/*Comentarios lleva al Post principal como lo hace Ver mas? */}
                        Comentarios
                    </Col>
                    <Col xs={4} style={{backgroundColor:"gray"}} as={NavLink} to={`/postDetails/${dataPost.idPost}`}>
                            Ver Mas
                    </Col>
                </Row>

            </Card.Body>
        </Card>
    )
}

export default FeedPost