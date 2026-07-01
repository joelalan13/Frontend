import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Eye } from 'lucide-react';
import postServices from '../services/postServices';
import usuarioServices from '../services/usuarioServices';
import type { Post, User } from '../types';

const PerfilUsuario = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate('/');
            return;
        }

        const fetchUserData = async () => {
            setLoading(true);
            try {
                // Cargar datos del usuario
                const userData = await usuarioServices.getUsuarioById(userId);
                setUser(userData);

                // Cargar posts del usuario
                const allPosts = await postServices.getPosts();
                const userPosts = allPosts.filter((post) => post.idUser === userId);
                setPosts(userPosts);
            } catch (err) {
                console.error('Error al cargar perfil:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, navigate]);

    if (loading) return <Spinner animation="border" className="mt-5" />;
    if (!user) return <Container><p>Usuario no encontrado</p></Container>;

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Perfil de {user.nombre} {user.apellido}</h1>
                <p className="text-muted">@{user.nickName}</p>
            </div>

            <h3 className="mb-3">Publicaciones ({posts.length})</h3>
            {posts.length > 0 ? (
                <Row>
                    {posts.map((post) => (
                        <Col md={4} key={post.idPost} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Text>{post.descripcion}</Card.Text>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Comentarios: {post.Comments?.length || 0}
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
            ) : (
                <p>Este usuario no tiene publicaciones aún</p>
            )}
        </Container>
    );
};

export default PerfilUsuario;
