import { Container } from "react-bootstrap"
import ErrorImage from "../assets/404-robot.png"
import "../styles/error404.css"

const Error404 = () => {
    return(
        <Container className="error404-container">
            <img
                src={ErrorImage}
                alt="404 Not Found"
                className="error-image"
            />
            <p className="error-text">Página no encontrada...</p>
        </Container>
    )   
}

export default Error404
