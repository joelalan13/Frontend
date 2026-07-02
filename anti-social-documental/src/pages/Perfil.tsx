import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert, Tab, Tabs, Image, Modal, Carousel, Form } from 'react-bootstrap';
import { Camera, Eye, Users } from 'lucide-react';

import ButtonScrollPerfil from '../component/ButtonScrollPerfil';
import usuarioServices from '../assets/services/usuarioServices';
// @ts-ignore: allow importing CSS without type declarations
import '../styles/carrusel.css';

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
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
    Comments?: any[];
};

const Perfil = () => {
    const [user, setUser] = useState<{ _id: string; nickName: string; nombre: string; apellido: string; fotoPerfil?: string; followers: any[]; following: any[] } | null>(null);
    const [mostrarImagenes, setMostrarImagenes] = useState(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [commentAuthors, setCommentAuthors] = useState<Record<string, string>>({});
    const [targetUserId, setTargetUserId] = useState('');
    const [targetUserInfo, setTargetUserInfo] = useState<{ _id?: string; nickName?: string; nombre?: string } | null>(null);
    const [isFollowingTarget, setIsFollowingTarget] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [followersDetails, setFollowersDetails] = useState<{ id: string; label: string }[]>([]);
    const [followingDetails, setFollowingDetails] = useState<{ id: string; label: string }[]>([]);
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

    useEffect(() => {
        if (!targetUserId || !user?._id || targetUserId === user._id) {
            setTargetUserInfo(null);
            setIsFollowingTarget(false);
            return;
        }

        const syncTargetUser = async () => {
            setIsFollowingTarget(isFollowingThisUser(targetUserId));
            try {
                const profile = await usuarioServices.getUserProfileById(targetUserId);
                setTargetUserInfo(profile);
            } catch (error) {
                console.error('No se pudo cargar el usuario objetivo', error);
                setTargetUserInfo(null);
            }
        };

        syncTargetUser();
    }, [targetUserId, user?._id, user?.following]);

    useEffect(() => {
        if (!user) {
            setFollowersDetails([]);
            setFollowingDetails([]);
            return;
        }

        const loadRelationshipUsers = async () => {
            const normalizeRelationships = async (items: any[]) => {
                const resolved = await Promise.all(items.map(async (item) => {
                    if (item && typeof item === 'object') {
                        const id = item._id || item.id || '';
                        const label = item.nickName || item.nickname || item.userName || [item.nombre, item.apellido].filter(Boolean).join(' ') || 'Usuario';
                        return { id, label };
                    }

                    if (typeof item === 'string' && item) {
                        try {
                            const profile = await usuarioServices.getUserProfileById(item);
                            const label = profile?.nickName || [profile?.nombre, profile?.apellido].filter(Boolean).join(' ') || item;
                            return { id: item, label };
                        } catch {
                            return { id: item, label: item };
                        }
                    }

                    return { id: '', label: 'Usuario' };
                }));

                return resolved.filter((entry) => entry.id || entry.label !== 'Usuario');
            };

            const [followers, following] = await Promise.all([
                normalizeRelationships(Array.isArray(user.followers) ? user.followers : []),
                normalizeRelationships(Array.isArray(user.following) ? user.following : [])
            ]);

            setFollowersDetails(followers);
            setFollowingDetails(following);
        };

        loadRelationshipUsers();
    }, [user?._id, user?.followers, user?.following]);

    useEffect(() => {
        const loadCommentAuthors = async () => {
            if (!selectedPost?.Comments?.length) {
                setCommentAuthors({});
                return;
            }

            const authors: Record<string, string> = {};

            for (const comment of selectedPost.Comments) {
                const userRef = comment?.idUser;

                if (userRef && typeof userRef === 'object') {
                    const nick = userRef.nickName || userRef.nickname || userRef.userName || userRef.nombre || 'Usuario';
                    if (userRef._id) authors[userRef._id] = nick;
                    continue;
                }

                if (typeof userRef === 'string' && userRef) {
                    if (authors[userRef]) continue;

                    try {
                        const response = await axios.get(`http://localhost:8080/usuario/${userRef}`);
                        const userData = response.data;
                        const nick = userData?.nickName || userData?.nickname || userData?.userName || userData?.nombre || 'Usuario';
                        authors[userRef] = nick;
                    } catch (error) {
                        console.error('No se pudo cargar el usuario del comentario', error);
                        authors[userRef] = 'Usuario';
                    }
                }
            }

            setCommentAuthors(authors);
        };

        loadCommentAuthors();
    }, [selectedPost]);

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

    const handleVerDetalle = (post: Post) => {
        setSelectedPost(post);
        setActiveIndex(0);
        setShowModal(true);
    };

    const getCommentAuthorName = (comment: any) => {
        const userRef = comment?.idUser;

        if (userRef && typeof userRef === 'object') {
            return userRef.nickName || userRef.nickname || userRef.userName || userRef.nombre || 'Usuario';
        }

        if (typeof userRef === 'string' && userRef) {
            return comment?.nickName || comment?.usuario?.nickName || commentAuthors[userRef] || 'Usuario';
        }

        return 'Usuario';
    };

    const isFollowingThisUser = (targetId: string) => {
        return (user?.following || []).some((item: any) => {
            if (typeof item === 'string') return item === targetId;
            return item?._id === targetId || item?.id === targetId;
        });
    };

    const handleFollowToggle = async () => {
        if (!user?._id || !targetUserId || targetUserId === user._id) return;

        setFollowLoading(true);

        try {
            if (isFollowingTarget) {
                await usuarioServices.unfollowUser(user._id, targetUserId);
                const updatedFollowing = (user.following || []).filter((item: any) => {
                    if (typeof item === 'string') return item !== targetUserId;
                    return item?._id !== targetUserId && item?.id !== targetUserId;
                });

                const updatedUser = { ...user, following: updatedFollowing };
                setUser(updatedUser);
                localStorage.setItem('usuario', JSON.stringify(updatedUser));
                setIsFollowingTarget(false);
            } else {
                await usuarioServices.followUser(user._id, targetUserId);
                const updatedFollowing = [...(user.following || []), targetUserId];
                const updatedUser = { ...user, following: updatedFollowing };
                setUser(updatedUser);
                localStorage.setItem('usuario', JSON.stringify(updatedUser));
                setIsFollowingTarget(true);
            }

            try {
                const profile = await usuarioServices.getUserProfileById(targetUserId);
                setTargetUserInfo(profile);
            } catch (error) {
                console.error('No se pudo recargar el perfil del usuario objetivo', error);
            }
        } catch (error) {
            console.error('Error al seguir/dejar de seguir', error);
            alert('No se pudo completar la acción.');
        } finally {
            setFollowLoading(false);
        }
    };

    const getPostTags = (post: Post | null | undefined) => {
        const rawTags = (post as any)?.tags ?? (post as any)?.Tags ?? [];

        if (Array.isArray(rawTags)) {
            return rawTags.flatMap((tag: any) => {
                if (typeof tag === 'string') {
                    return tag
                        .split(',')
                        .map((item: string) => item.trim())
                        .filter(Boolean);
                }

                if (tag && typeof tag === 'object') {
                    const nombre = tag.nombre || tag.name || tag.text || tag.label || tag.tag || '';
                    return nombre ? [nombre] : [];
                }

                return [];
            });
        }

        if (typeof rawTags === 'string') {
            return rawTags
                .split(',')
                .map((item: string) => item.trim())
                .filter(Boolean);
        }

        return [];
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
                
                <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
                    <div className="border rounded px-3 py-2" style={{ minWidth: '180px' }}>
                        <div><strong>{user?.followers?.length || 0}</strong> Seguidores</div>
                        <div className="small text-muted mt-1">
                            {followersDetails.length > 0 ? (
                                followersDetails.slice(0, 5).map((person) => (
                                    <div key={person.id || person.label}>{person.label}</div>
                                ))
                            ) : (
                                <span>No tienes seguidores todavía</span>
                            )}
                        </div>
                    </div>
                    <div className="border rounded px-3 py-2" style={{ minWidth: '180px' }}>
                        <div><strong>{user?.following?.length || 0}</strong> Seguidos</div>
                        <div className="small text-muted mt-1">
                            {followingDetails.length > 0 ? (
                                followingDetails.slice(0, 5).map((person) => (
                                    <div key={person.id || person.label}>{person.label}</div>
                                ))
                            ) : (
                                <span>No sigues a nadie todavía</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column align-items-center gap-2 mt-3" style={{ maxWidth: '360px', width: '100%' }}>
                    <div className="d-flex gap-2 w-100">
                        <Form.Control
                            size="sm"
                            placeholder="ID del usuario a seguir"
                            value={targetUserId}
                            onChange={(e) => {
                                setTargetUserId(e.target.value);
                                setTargetUserInfo(null);
                            }}
                        />
                        <Button size="sm" onClick={handleFollowToggle} disabled={followLoading || !targetUserId || targetUserId === user?._id}>
                            {followLoading ? '...' : isFollowingTarget ? 'Dejar de seguir' : 'Seguir'}
                        </Button>
                    </div>
                    {targetUserInfo && (
                        <small className="text-muted">
                            {targetUserInfo.nickName || targetUserInfo.nombre || 'Usuario objetivo'}
                        </small>
                    )}
                </div>
            </div>

            {/* Pestañas de Posts */}
            <ButtonScrollPerfil activo={mostrarImagenes} setActivo={setMostrarImagenes} />

            <Row className="mt-4 g-3">
                {mostrarImagenes ? (
                    postsConImagen.map(post => (
                        <Col md={4} key={post._id}>
                            <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => handleVerDetalle(post)}>
                                <Card.Img 
                                    variant="top" 
                                    src={`http://localhost:8080${post.images?.[0]?.url}`} 
                                    style={{ height: '220px', objectFit: 'cover' }}
                                />
                                {post.images && post.images.length > 1 && (
                                    <Card.Footer className="text-muted small">
                                        {post.images.length} imágenes
                                    </Card.Footer>
                                )}
                            </Card>
                        </Col>
                    ))
                ) : (
                    // MODO TEXTO (Estilo Twitter)
                    postsSinImagen.map(post => (
                        <Col md={12} key={post._id} className="d-flex justify-content-center">
                            <Card 
                                className="mb-3 p-3 border-0 shadow-sm" 
                                style={{ 
                                    width: '100%', 
                                    maxWidth: '600px', 
                                    borderRadius: '12px',
                                    backgroundColor: '#f8f9fa', // Gris claro solicitado
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleVerDetalle(post)}
                            >
                                <Card.Body>
                                    <Card.Text style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
                                        {post.descripcion}
                                    </Card.Text>

                                    {/* AQUÍ ESTÁ LA LÓGICA DE TAGS */}
                                    {getPostTags(post).length > 0 && (
                                        <div className="d-flex flex-wrap mb-2">
                                            {getPostTags(post).map((tag: any, index: number) => (
                                                <span 
                                                    key={`${tag}-${index}`} 
                                                    className="badge bg-info text-dark me-2 mb-2"
                                                    style={{ fontSize: '0.85rem', fontWeight: '500' }}
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <small className="text-muted d-block mt-2">
                                        Publicado el: {new Date(post.createdAt || '').toLocaleDateString()}
                                    </small>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" >
                <Modal.Header closeButton>
                    <Modal.Title>Detalle</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Row>
                        <Col md={7}>
                            {selectedPost?.images && selectedPost.images.length > 0 ? (
                                <Carousel activeIndex={activeIndex} onSelect={(index) => setActiveIndex(index)} interval={null}>
                                    {selectedPost.images.map((image, index) => (
                                        <Carousel.Item key={image._id || `${image.url}-${index}`}>
                                            <img
                                                src={`http://localhost:8080${image.url}`}
                                                className="d-block w-100 rounded"
                                                style={{ height: '420px', objectFit: 'cover' }}
                                                alt={`Imagen ${index + 1}`}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : (
                                <div className="text-muted">No hay imágenes para mostrar.</div>
                            )}
                        </Col>
                        <Col md={5}>
                            <p>{selectedPost?.descripcion}</p>
                            {getPostTags(selectedPost).length > 0 ? (
                                <div className="mb-3">
                                    {getPostTags(selectedPost).map((tag: any, index: number) => (
                                        <span key={`${tag}-${index}`} className="badge bg-secondary me-2 mb-2">
                                            #{typeof tag === 'string' ? tag : tag?.nombre || 'tag'}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                            <hr />
                            <h6>Comentarios</h6>
                            {selectedPost?.Comments && selectedPost.Comments.length > 0 ? (
                                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                    {selectedPost.Comments.map((comment: any, index: number) => (
                                        <div key={comment.idComment || comment._id || index} className="mb-3 p-2 border rounded bg-light">
                                            <strong>{getCommentAuthorName(comment)}</strong>
                                            <div>{comment.contenido || 'Sin texto'}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted">No hay comentarios aún.</div>
                            )}
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Perfil;