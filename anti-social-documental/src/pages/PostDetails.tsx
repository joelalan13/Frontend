import { useParams } from "react-router-dom"
import { Container, Row, Col} from "react-bootstrap"

import listaPost from "../data/Post"
import FeedPost from "../component/FeedPost"
import Comment from "../component/Comment"
import CommentForm from "../component/CommentForm"

const PostDetails = () =>{
    const {idPost} = useParams()
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
        )
    }

    return(
        <Container>
            <Row>
                <FeedPost dataPost={postEncontrado}/>                
            </Row>

            <Row >
                <Col>
                    
                    {postEncontrado.comentarios && postEncontrado.comentarios.length > 0 ? (
                        postEncontrado.comentarios.map((comentario) => (
                            <Comment key={comentario.idComentario} comment={comentario}/>
                        ))
                    ) : (
                        <p>No hay comentarios aún</p>
                    )}
                </Col>
            </Row>

            <Row style={{marginTop: "20px"}}>
                <Col>
                    <CommentForm />
                </Col>
            </Row>
        </Container>
    )
}

export default PostDetails
