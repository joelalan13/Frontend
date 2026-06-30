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
        setYaClickeado(prev => !prev);

        setLikes(prev =>
            yaClickeado ? prev - 1 : prev + 1
        );
    };

    const cantComentarios = dataPost.comentarios?.length || 0

    return(
        <Card className="mt-3">
            {/*Cabecera del post que tendra el userName*/}
            
            <Card.Header>
                {dataPost.idUser}
            </Card.Header>
            <Card.Body>
                {/*Tags del post */}
            
                <div className="mb-2">
                    {dataPost.tags.map(tag =>(
                        <Badge bg="primary" key={tag.idTag}>{tag.nombre}</Badge>
                    ))}
                </div>
            
                <Card.Img variant="top" src={dataPost.url} className="card-image-post"/>
                {/*Descripcion de Post*/}
                <Card.Text className="mt-3">
                    {dataPost.info}
                </Card.Text>
                
                {/*Botones*/}
                    <Button onClick={() => handleClick()}>
                         Me gustas {likes}
                    </Button>
                    <Button as={NavLink} to={`/postDetails/${dataPost.idPost}`}>
                        {/*Comentarios lleva al Post principal como lo hace Ver mas? */}
                        Comentarios
                    </Button>
                    <Button style={{backgroundColor:"gray"}} as={NavLink} to={`/postDetails/${dataPost.idPost}`}>
                            Ver Mas...
                    </Button>
            </Card.Body>
        </Card>
    )
}

export default FeedPost