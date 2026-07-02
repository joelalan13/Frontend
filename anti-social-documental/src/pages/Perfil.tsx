import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert, Tab, Tabs, Image, Modal } from 'react-bootstrap';
import { Camera, Eye, Users } from 'lucide-react';

import ButtonScrollPerfil from '../component/ButtonScrollPerfil';

type PostImage = {
    _id?: string;
    url: string;
    createdAt?: string;
    updatedAt?: string;
};

type Post = {
    _id?: string;
    idUser: string;
    descripcion: string;
    images?: PostImage[];
    Tags?: string[];
    createdAt?: string;
    updatedAt?: string;
    Comments?: any[];
};

const Perfil = () => {
    const [user, setUser] = useState<{ _id: string; nickName: string; nombre: string; apellido: string; fotoPerfil?: string; followers: any[]; following: any[] } | null>(null);
    const [mostrarImagenes, setMostrarImagenes] = useState(true);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Primer useEffect: Carga el usuario
    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        console.log("Usuario almacenado en localStorage:", storedUser);
        if (!storedUser) {
            navigate('/login');
        } else {
            console.log("Cargando usuario desde localStorage...");
            localStorage.setItem('usuario', JSON.stringify(JSON.parse(storedUser))); // Asegura que el usuario esté en el formato correcto
            setUser(JSON.parse(storedUser));
        }
        setIsChecking(false); 
    }, [navigate]);

    
    
    useEffect(() => {
        if (!user) return;

        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/posts?userId=${user._id}`);
                setPosts(response.data);
            } catch (err) {
                console.error('Error al cargar posts', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user]);

    if (isChecking) {
        return <Spinner animation="border" className="mt-5" />;
    }

    if (!user) {
        return null;
    }

    const postsConImagen = posts.filter(p => p.images && p.images.length > 0);
    const postsSinImagen = posts.filter(p => !p.images || p.images.length === 0);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const storedUserRaw = localStorage.getItem('usuario'); // Obtiene el usuario almacenado en localStorage
        const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null; // Asegura que el usuario esté en el formato correcto
        const currentUser = storedUser || user; // Usa el usuario almacenado o el estado actual
        const userId = currentUser?._id || currentUser?.id; // Asegura que el ID del usuario esté definido

        if (!userId) {
            console.error("Error crítico: El ID del usuario es undefined");
            alert("Error: No se pudo identificar al usuario. Por favor, recarga la página.");
            return;
        }

        const formData = new FormData();
        formData.append('fotoPerfil', file);

        try {
            console.log("Subiendo foto de perfil para el usuario:", userId);
            const response = await axios.put(`http://localhost:8080/usuario/${userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updatedUserData = response.data?.usuario || response.data; // Asegura que se obtenga el usuario actualizado correctamente
            const normalizedUser = { 
                ...currentUser,
                ...updatedUserData,
                _id: updatedUserData?._id || updatedUserData?.id || currentUser?._id || currentUser?.id,
            };

            localStorage.setItem('usuario', JSON.stringify(normalizedUser));
            setUser(normalizedUser);
            console.log("Usuario actualizado en localStorage:", normalizedUser);
            alert("Foto actualizada");
        } catch (error) {
            console.error("Error al subir la foto", error);
            alert("No se pudo actualizar la foto. Intenta nuevamente.");
        }
    };

    const handleVerDetalle = (post: any) => {
    setSelectedPost(post);
    setShowModal(true);
    };
    
    return (
        <Container className="mt-5 text-center">
            {/* Header: Foto, Nick, Nombre, Seguidores */}
            <div className="d-flex flex-column align-items-center mb-4">
                <div className="position-relative">
                    <input 
                        type="file" 
                        id="fileInput" 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange} 
                    />
                    <div className="position-relative d-inline-block">
                    <Image 
                        src={user.fotoPerfil ? `http://localhost:8080${user.fotoPerfil}` : "https://via.placeholder.com/150"}
                        roundedCircle 
                        width={150} 
                        height={150}
                        style={{ objectFit: 'cover' }} // Esto ayuda a que no se deforme 
                    />
                    {/* Botón flotante para cambiar */}
                    <Button 
                        variant="secondary" 
                        className="position-absolute bottom-0 end-0 rounded-circle"
                        onClick={() => document.getElementById('fileInput')?.click()}
                    >
                        <Camera size={16} />
                    </Button>
                </div>
                    
                </div>
                <h2 className="mt-3">{user?.nickName}</h2>
                <p className="text-muted">{user?.nombre} {user?.apellido}</p>
                
                <div className="d-flex gap-4">
                    <span><strong>{user?.followers?.length || 0}</strong> Seguidores</span>
                    <span><strong>{user?.following?.length || 0}</strong> Seguidos</span>
                </div>
            </div>

            {/* Pestañas de Posts */}
            <ButtonScrollPerfil activo={mostrarImagenes} setActivo={setMostrarImagenes} />

            <Row className="mt-4">
                {mostrarImagenes ? (
                    // MODO IMÁGENES
                    postsConImagen.map(post => (
                        <Col md={4} key={post._id}>
                            <Card className="mb-3 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => handleVerDetalle(post)}>
                                <Card.Img 
                                    variant="top" 
                                    src={`http://localhost:8080${post.images?.[0]?.url}`} 
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            </Card>
                        </Col>
                    ))
                ) : (
                    // MODO TEXTO (Estilo Twitter)
                    postsSinImagen.map(post => (
                        <Col md={12} key={post._id} className="d-flex justify-content-center">
                            <Card className="mb-3 p-3 border-0 shadow-sm" style={{ width: '100%', maxWidth: '600px', borderRadius: '12px' }}>
                                <Card.Body>
                                    <Card.Text style={{ fontSize: '1.1rem' }}>{post.descripcion}</Card.Text>
                                    <small className="text-muted">Publicado el: {new Date(post.createdAt || '').toLocaleDateString()}</small>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <img src={`http://localhost:8080${selectedPost?.images?.[0]?.url}`} className="img-fluid rounded" />
                        </Col>
                        <Col md={6}>
                            <p>{selectedPost?.descripcion}</p>
                            <hr />
                            <h6>Comentarios</h6>
                            {/* Si tienes una lista de comentarios, este es el lugar para mostrarla */}
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Perfil;