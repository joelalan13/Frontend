import { useState } from "react";
import { Card, Container, Row, Form } from "react-bootstrap"


const Comment = ({ dataComment }) => {
    const [comentarios,setComentarios] = useState(dataComment)
    return (
        <Container>
            {dataComment.map((comentario) => (
                <Row key={comentario.idComentario}>
                    <p>{comentario.idUser} : {comentario.contenido}</p>
                </Row>
            ))}
        </Container>
    );
};

export default Comment;