import { Container } from "react-bootstrap"
import "../styles/error404.css"

const Error404 = () => {
    return(
        <Container className="error404-container">
            <img
                src="https://img.magnific.com/vector-premium/pagina-error-gato-gatito-dormido-caja-signo-404-paginas-vacias-no-encontradas-problemas-internet-computadora-perdio-sitio-web-dibujos-animados-gatito-gordito-espacio-blanco-ilustracion-vectorial-problema-internet-pagina_81894-11672.jpg?semt=ais_hybrid&w=740&q=80"
                alt="404 Not Found"
                className="error-image"
            />
            <p className="error-text">Página no encontrada...</p>
        </Container>
    )   
}

export default Error404
