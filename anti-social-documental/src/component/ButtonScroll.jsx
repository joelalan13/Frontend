import { useState } from "react"
import {Container, Row, Col} from "react-bootstrap"

const ButtonScroll = () =>{
    const [activo,setActivo] = useState(true)
    return(
       <Container fluid ="md">
            {/*Fila para Separar Publicaciones en General/siguiendo */}

                <Row>
                    <Col
                        xs={6}
                        onClick={() => setActivo(true)}
                        style={{
                            cursor: "pointer",
                            textAlign: "center",
                            padding: "10px",
                            backgroundColor: activo ? "#00b94d" : "#6e6e6e",
                            color: activo ? "white" : "black",
                            border: activo?"#ff0000 1px solid":"rgba(41, 0, 88, 0) 1px solid",
                            transition: "0.2s"
                        }}
                    >
                        Sugerencia
                    </Col>
                    <Col
                        xs={6}
                        onClick={() => setActivo(false)}
                        style={{
                            cursor: "pointer",
                            textAlign: "center",
                            padding: "10px",
                            backgroundColor: activo ? "#555555" : "#00b94d",
                            color: activo ? "white" : "black",
                            border: activo?"#ff0000 1px solid":"rgba(41, 0, 88, 0) 1px solid",
                            transition: "0.2s"
                        }}
                    >
                        Seguidos
                    </Col>
                </Row>
       </Container>
        
    )
}

export default ButtonScroll