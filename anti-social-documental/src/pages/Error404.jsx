import { Container } from "react-bootstrap"
import ErrorImage from "../assets/404.gray.png"

{/*.error-image {
    width: min(80vw, 350px);
    height: auto;
}*/}
const Error404 = () =>{
    return(
        <Container className="mt-5 text-center">
            <img
                src={ErrorImage}
                alt="404 Not Found"
                className="error-image"
            />
            <p className="error-text">Página no encontrada</p>
        </Container>
    )   
}

export default Error404