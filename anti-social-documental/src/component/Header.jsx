import { Container, Nav, Navbar} from "react-bootstrap"
import {NavLink, Link} from "react-router-dom"

{/*Nav bar que hay que volver responsive */}

const Header = () =>{
    return (
        <Navbar bg="light" expand="lg">
            <Container >
                
                <Navbar.Brand>
                    <span className="actual-text">&nbsp;NameLog&nbsp;</span>
                </Navbar.Brand>
                <Navbar.Collapse>

                {/*Links que llevaran a las distintas paginas */}
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/">
                            Inicio
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/perfil">
                            Perfil
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/newPost">
                            Crear Post
                        </Nav.Link>
                        <Nav.Link>
                            Cerrar Sesion
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header