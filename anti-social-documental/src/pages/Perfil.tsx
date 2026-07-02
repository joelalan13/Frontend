import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { filterRecentPosts } from '../utils/dateFilters';
import { API_URL } from '../constants';

import ButtonScrollPerfil from '../component/ButtonScrollPerfil';
import ProfileHeader from '../component/ProfileHeader';
import ProfilePostImageCard from '../component/ProfilePostImageCard';
import ProfilePostTextCard from '../component/ProfilePostTextCard';
import ProfilePostDetailModal from '../component/ProfilePostDetailModal';
import usuarioServices from "../services/usuarioServices";
// @ts-ignore: allow importing CSS without type declarations
import '../styles/profileStyles.css';

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
    // Estado principal del perfil
    const [user, setUser] = useState<{ _id: string; nickName: string; nombre: string; apellido: string; fotoPerfil?: string; followers: any; following: any } | null>(null);
    const [mostrarImagenes, setMostrarImagenes] = useState(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [commentAuthors, setCommentAuthors] = useState<Record<string, string>>({});
    const [targetUserName, setTargetUserName] = useState('');
    const [targetUserInfo, setTargetUserInfo] = useState<{ _id?: string; nickName?: string; nombre?: string } | null>(null);
    const [isFollowingTarget, setIsFollowingTarget] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [followersDetails, setFollowersDetails] = useState<{ id: string; label: string }[]>([]);
    const [followingDetails, setFollowingDetails] = useState<{ id: string; label: string }[]>([]);
    const [profileImageError, setProfileImageError] = useState(false);
    const navigate = useNavigate();

    // Helpers de normalización y conteo de relaciones
    const getRelationshipItems = (value: any) => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'object') {
            if (Array.isArray(value.items)) return value.items;
            if (Array.isArray(value.data)) return value.data;
            if (Array.isArray(value.followers)) return value.followers;
            if (Array.isArray(value.following)) return value.following;
        }
        return [];
    };

    const getRelationshipCount = (value: any) => {
        if (Array.isArray(value)) return value.length;
        if (typeof value === 'number') return value;
        if (value && typeof value === 'object') {
            if (typeof value.count === 'number') return value.count;
            if (typeof value.total === 'number') return value.total;
            if (typeof value.length === 'number') return value.length;
            if (Array.isArray(value.items)) return value.items.length;
            if (Array.isArray(value.data)) return value.data.length;
        }
        return 0;
    };

    const normalizeUserData = (value: any, fallbackUser?: any) => {
        if (!value) return value;

        const photoValue = value.fotoPerfil ?? value.fotoPerfilUrl ?? value.profilePicture ?? value.foto ?? value.avatar ?? value.photo ?? value.image ?? fallbackUser?.fotoPerfil ?? fallbackUser?.fotoPerfilUrl ?? fallbackUser?.profilePicture ?? fallbackUser?.foto ?? fallbackUser?.avatar ?? fallbackUser?.photo ?? fallbackUser?.image ?? null;

        return {
            ...value,
            fotoPerfil: photoValue,
            followers: value.followers ?? value.followersCount ?? value.followersTotal ?? value.seguidores ?? [],
            following: value.following ?? value.followingCount ?? value.followingTotal ?? value.seguidos ?? []
        };
    };

    const getProfileImageSrc = (fotoPerfil?: string) => {
        if (!fotoPerfil || profileImageError) return 'https://via.placeholder.com/150';
        if (fotoPerfil.startsWith('http://') || fotoPerfil.startsWith('https://')) return fotoPerfil;
        if (fotoPerfil.startsWith('/')) return `${API_URL}${fotoPerfil}`;
        return `${API_URL}/${fotoPerfil}`;
    };

    // Efecto: resetear la imagen de perfil cuando cambia el usuario
    useEffect(() => {
        setProfileImageError(false);
    }, [user?._id, user?.fotoPerfil]);

    // Efecto: cargar el usuario desde localStorage al entrar al perfil
    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        console.log("Usuario almacenado en localStorage:", storedUser);
        if (!storedUser) {
            navigate('/login');
        } else {
            console.log("Cargando usuario desde localStorage...");
            const parsedUser = JSON.parse(storedUser);
            localStorage.setItem('usuario', JSON.stringify(parsedUser));
            setUser(normalizeUserData(parsedUser));
        }
        setIsChecking(false); 
    }, [navigate]);

    // Efecto: cargar los posts del usuario autenticado
    useEffect(() => {
        if (!user) return;

        const fetchUserPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/posts`);
                // Filtrar solo posts del usuario actual y de menos de 6 meses
                const userPosts = Array.isArray(response.data) 
                    ? response.data.filter((post) => post.idUser === user._id || post.idUser === user.idUser)
                    : [];
                const recentUserPosts = filterRecentPosts(userPosts);
                setPosts(recentUserPosts);
            } catch (err) {
                console.error('Error al cargar posts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [user]);

    // Efecto: sincronizar el estado de seguimiento con el usuario objetivo
    useEffect(() => {
        if (!targetUserName || !user?._id || targetUserName.toLowerCase() === user.nickName?.toLowerCase()) {
            setTargetUserInfo(null);
            setIsFollowingTarget(false);
            return;
        }

        const syncTargetUser = async () => {
            try {
                const users = await usuarioServices.getUsuarios();
                const matchedUser = users.find((candidate: any) => candidate?.nickName?.toLowerCase() === targetUserName.toLowerCase()) as any;

                if (!matchedUser) {
                    setTargetUserInfo(null);
                    setIsFollowingTarget(false);
                    return;
                }

                setIsFollowingTarget(isFollowingThisUser(matchedUser._id || matchedUser.id));
                setTargetUserInfo(matchedUser);
            } catch (error) {
                console.error('No se pudo cargar el usuario objetivo', error);
                setTargetUserInfo(null);
                setIsFollowingTarget(false);
            }
        };

        syncTargetUser();
    }, [targetUserName, user?._id, user?.following, user?.nickName]);

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
                normalizeRelationships(getRelationshipItems(user.followers)),
                normalizeRelationships(getRelationshipItems(user.following))
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

    // Asegúrate de que el useEffect que carga los datos sea robusto
    useEffect(() => {
        const loadUserData = async () => {
            const storedUser = localStorage.getItem('usuario');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                try {
                    const updatedUser = await usuarioServices.getUserProfileById(parsedUser._id);
                    setUser(normalizeUserData(updatedUser, parsedUser));
                } catch (e) {
                    setUser(normalizeUserData(parsedUser, parsedUser)); // Fallback al local
                }
            }
        };
        loadUserData();
    }, []);

    if (isChecking) {
        return <Spinner animation="border" className="mt-5" />;
    }

    if (!user) {
        return null;
    }

    // Separación de posts por tipo para la vista del perfil
    const postsConImagen = posts.filter(p => p.images && p.images.length > 0);
    const postsSinImagen = posts.filter(p => !p.images || p.images.length === 0);

    // Handlers de acciones del perfil
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const storedUserRaw = localStorage.getItem('usuario');
        const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
        const currentUser = storedUser || user;
        const userId = currentUser?._id || currentUser?.id;

        if (!userId) {
            console.error("Error crítico: El ID del usuario es undefined");
            alert("Error: No se pudo identificar al usuario. Por favor, recarga la página.");
            return;
        }

        const formData = new FormData();
        formData.append('fotoPerfil', file);

        try {
            console.log("Subiendo foto de perfil para el usuario:", userId);
            const response = await axios.put(`${API_URL}/usuario/${userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updatedUserData = response.data?.usuario || response.data;
            const normalizedUser = { 
                ...currentUser,
                ...updatedUserData,
                fotoPerfil: updatedUserData?.fotoPerfil || updatedUserData?.fotoPerfilUrl || updatedUserData?.profilePicture || currentUser?.fotoPerfil || currentUser?.fotoPerfilUrl || currentUser?.profilePicture || null,
                _id: updatedUserData?._id || updatedUserData?.id || currentUser?._id || currentUser?.id,
            };

            localStorage.setItem('usuario', JSON.stringify(normalizedUser));
            setUser(normalizedUser);
            setProfileImageError(false);
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
        if (!user?._id || !targetUserName.trim()) return;

        const normalizedTarget = targetUserName.trim();
        if (normalizedTarget.toLowerCase() === user.nickName?.toLowerCase()) {
            alert('No puedes seguirte a vos mismo.');
            return;
        }

        setFollowLoading(true);

        try {
            const users = await usuarioServices.getUsuarios();
            const matchedUser = users.find((candidate: any) => candidate?.nickName?.toLowerCase() === normalizedTarget.toLowerCase()) as any;

            if (!matchedUser) {
                alert('No se encontró un usuario con ese nickname.');
                setFollowLoading(false);
                return;
            }

            const targetUserId = matchedUser._id || matchedUser.id;

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

            setTargetUserInfo(matchedUser);
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
    
    // Render del perfil
    return (
        <Container className="mt-5 text-center">
            <ProfileHeader
                user={user}
                targetUserId={targetUserName}
                targetUserInfo={targetUserInfo}
                followLoading={followLoading}
                isFollowingTarget={isFollowingTarget}
                onFileChange={handleFileChange}
                onFollowToggle={handleFollowToggle}
                onTargetUserIdChange={(value) => {
                    setTargetUserName(value);
                    setTargetUserInfo(null);
                }}
                getRelationshipCount={getRelationshipCount}
                getProfileImageSrc={getProfileImageSrc}
                onProfileImageError={() => setProfileImageError(true)}
                onProfileImageLoad={() => setProfileImageError(false)}
            />

            {/* Pestañas de Posts */}
            <ButtonScrollPerfil activo={mostrarImagenes} setActivo={setMostrarImagenes} />

            <Row className="mt-4 g-3">
                {mostrarImagenes ? (
                    postsConImagen.map(post => (
                        <Col md={4} key={post._id}>
                            <ProfilePostImageCard post={post} onClick={() => handleVerDetalle(post)} />
                        </Col>
                    ))
                ) : (
                    postsSinImagen.map(post => (
                        <Col md={12} key={post._id} className="d-flex justify-content-center">
                            <ProfilePostTextCard post={post} onClick={() => handleVerDetalle(post)} getPostTags={getPostTags} />
                        </Col>
                    ))
                )}
            </Row>
            <ProfilePostDetailModal
                show={showModal}
                onHide={() => setShowModal(false)}
                selectedPost={selectedPost}
                activeIndex={activeIndex}
                onSelect={(index) => setActiveIndex(index)}
                getPostTags={getPostTags}
                getCommentAuthorName={getCommentAuthorName}
            />
        </Container>
    );
};

export default Perfil;
