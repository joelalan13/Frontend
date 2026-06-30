import { Container, Nav, Navbar} from "react-bootstrap"
import {NavLink, Link} from "react-router-dom"

{/*Nav bar que hay que volver responsive */}

const Header = () =>{
    return (
        <Navbar expand="lg" style={{background:"gray"}}>
                <Navbar.Brand as={NavLink} to="/">
                    <span className="actual-text">&nbsp;NameLog&nbsp;</span>
                </Navbar.Brand>
                <Navbar.Toggle/>
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
        </Navbar>
    )
}

export default Header