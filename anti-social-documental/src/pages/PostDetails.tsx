{/*Aca donde te lleva "ver mas" que aparece en los posts del feed o inicio */}
{/*Aca necesitaremos de Post? */}
import { useParams } from "react-router"
import { Container, Row, Col} from "react-bootstrap";


import listaPost from "../data/Post"
import FeedPost from "../component/FeedPost";
import Comment from "../component/Comment";


const PostDetails = () =>{
    const {idPost} = useParams();
    const postEncontrado = listaPost.find((post) => post.idPost === Number(idPost))
    
    if (!postEncontrado) {
        return (
            <Container>
                <Row>
                    <Col>
                        <h2>Post no encontrado</h2>
                    </Col>
                </Row>
            </Container>
        );
    }
    return(
        <Container>
            <Row>
                <FeedPost dataPost={postEncontrado}/>                
            </Row>
            <Row style={{background:"gray"}}>
                <Comment dataComment={postEncontrado.comentarios}/>
            </Row>

        </Container>
    )
}

export default PostDetails