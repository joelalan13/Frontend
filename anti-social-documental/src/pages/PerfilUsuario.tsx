import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
// @ts-ignore: Allow side-effect CSS import without declarations
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

const PerfilUsuario = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<{ _id: string; idUser?: string; nickName: string; nombre: string; apellido: string; fotoPerfil?: string; followers: any; following: any } | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [mostrarImagenes, setMostrarImagenes] = useState(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [commentAuthors, setCommentAuthors] = useState<Record<string, string>>({});
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [followersDetails, setFollowersDetails] = useState<{ id: string; label: string }[]>([]);
    const [followingDetails, setFollowingDetails] = useState<{ id: string; label: string }[]>([]);
    const [profileImageError, setProfileImageError] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

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

    useEffect(() => {
        setProfileImageError(false);
    }, [user?._id, user?.fotoPerfil]);

    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setCurrentUser(normalizeUserData(parsedUser));
        }
    }, []);

    useEffect(() => {
        if (!userId) {
            navigate('/');
            return;
        }

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const userData = await usuarioServices.getUserProfileById(userId);
                setUser(normalizeUserData(userData));

                if (currentUser && (userData._id === currentUser._id || userData._id === currentUser.idUser)) {
                    setIsOwnProfile(true);
                } else {
                    setIsOwnProfile(false);
                    if (currentUser) {
                        const targetId = userData._id ?? userData.idUser ?? '';
                        const following = isFollowingThisUser(targetId);
                        setIsFollowing(following);
                    }
                }
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, navigate, currentUser]);

    useEffect(() => {
        if (!user) return;

        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/posts`);
                const userPosts = Array.isArray(response.data)
                    ? response.data.filter((post) => post.idUser === user._id || post.idUser === user.idUser)
                    : [];
                const recentUserPosts = filterRecentPosts(userPosts);
                setPosts(recentUserPosts);
            } catch (err) {
            }
        };

        fetchUserPosts();
    }, [user]);

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
                        const response = await axios.get(`${API_URL}/usuario/${userRef}`);
                        const userData = response.data;
                        const nick = userData?.nickName || userData?.nickname || userData?.userName || userData?.nombre || 'Usuario';
                        authors[userRef] = nick;
                    } catch (error) {
                        authors[userRef] = 'Usuario';
                    }
                }
            }

            setCommentAuthors(authors);
        };

        loadCommentAuthors();
    }, [selectedPost]);

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
        return (currentUser?.following || []).some((item: any) => {
            if (typeof item === 'string') return item === targetId;
            return item?._id === targetId || item?.id === targetId;
        });
    };

    const handleFollowToggle = async () => {
        if (!currentUser?._id || !user?._id) return;

        setFollowLoading(true);

        try {
            if (isFollowing) {
                await usuarioServices.unfollowUser(currentUser._id, user._id);
                setIsFollowing(false);
                
                const updatedCurrentUser = {
                    ...currentUser,
                    following: (currentUser.following || []).filter((item: any) => {
                        if (typeof item === 'string') return item !== user._id;
                        return item?._id !== user._id && item?.id !== user._id;
                    })
                };
                localStorage.setItem('usuario', JSON.stringify(updatedCurrentUser));
                setCurrentUser(updatedCurrentUser);
            } else {
                await usuarioServices.followUser(currentUser._id, user._id);
                setIsFollowing(true);
                
                const updatedCurrentUser = {
                    ...currentUser,
                    following: [...(currentUser.following || []), user._id]
                };
                localStorage.setItem('usuario', JSON.stringify(updatedCurrentUser));
                setCurrentUser(updatedCurrentUser);
            }
        } catch (error) {
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

    if (loading) {
        return <Spinner animation="border" className="mt-5" />;
    }

    if (!user) {
        return (
            <Container className="mt-5 text-center">
                <p style={{ color: '#00D166', fontSize: '1.5rem', marginTop: '2rem' }}>
                    Usuario no encontrado
                </p>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        marginTop: '1rem',
                        padding: '10px 20px',
                        backgroundColor: '#00D166',
                        color: '#030A04',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                    }}
                >
                    Volver al inicio
                </button>
            </Container>
        );
    }

    const postsConImagen = posts.filter(p => p.images && p.images.length > 0);
    const postsSinImagen = posts.filter(p => !p.images || p.images.length === 0);

    return (
        <Container className="mt-5 text-center">
            <ProfileHeader
                user={user}
                targetUserId=""
                targetUserInfo={null}
                followLoading={followLoading}
                isFollowingTarget={isFollowing}
                onFileChange={() => {}}
                onFollowToggle={isOwnProfile ? () => {} : handleFollowToggle}
                onTargetUserIdChange={() => {}}
                getRelationshipCount={getRelationshipCount}
                getProfileImageSrc={getProfileImageSrc}
                onProfileImageError={() => setProfileImageError(true)}
                onProfileImageLoad={() => setProfileImageError(false)}
                isOtherUserProfile={!isOwnProfile}
            />

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

export default PerfilUsuario;
