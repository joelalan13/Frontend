import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { LogOut, Eye } from 'lucide-react';
import usuarioServices from '../services/usuarioServices';
import type { Post, User } from '../types';

const Perfil = () => {
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        if (!storedUser) {
            navigate('/login'); // Si no hay sesión, manda al login
            return;
        }

        setUser(JSON.parse(storedUser));
    }, [navigate]);

    useEffect(() => {
        if (!user) return;

        const fetchPosts = async () => {
            setLoading(true);
            try {
                const userPosts = await usuarioServices.getPostsByUsuarioId(user.idUser);
                setPosts(userPosts);
            } catch (err) {
                console.error('Error al cargar posts', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    if (loading) return <Spinner animation="border" className="mt-5" />;

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Perfil de {user?.nickName}</h1>
            </div>

            <h3 className="mb-3">Mis Publicaciones</h3>
            <Row>
                {posts.map((post) => (
                    <Col md={4} key={post.idPost} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Text>{post.descripcion}</Card.Text>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Comentarios: {post.comentarios?.length || 0}
                                </Card.Subtitle>
                                <Button 
                                    variant="primary" 
                                    onClick={() => navigate(`/postDetails/${post.idPost}`)}
                                >
                                    <Eye size={16} className="me-1" /> Ver más
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Perfil;
