import { useEffect, useState } from 'react';
import { Col, Carousel, Modal, Row } from 'react-bootstrap';
import { Trash2, Edit2, ImagePlus } from 'lucide-react';
import MoreOptionsMenu from './MoreOptionsMenu';
import type { Post, PostImage } from '../types';
// @ts-ignore: allow importing CSS without type declarations
import '../styles/profilePostDetailModal.css';

type ProfilePostDetailModalProps = {
    show: boolean;
    onHide: () => void;
    selectedPost: Post | null;
    activeIndex: number;
    onSelect: (index: number) => void;
    getPostTags: (post: Post | null | undefined) => Array<string | { nombre: string }>;
    getCommentAuthorName: (comment: any) => string;
    isOwnPost?: boolean;
    onEditDescription?: (postId: string, description: string) => Promise<void>;
    onAddImage?: (postId: string, url: string) => Promise<PostImage | null>;
    onDeleteImage?: (postId: string, imageId: string) => Promise<boolean>;
    onDeletePost?: (postId: string) => Promise<void>;
};

const ProfilePostDetailModal = ({
    show,
    onHide,
    selectedPost,
    activeIndex,
    onSelect,
    getPostTags,
    getCommentAuthorName,
    isOwnPost = false,
    onEditDescription,
    onAddImage,
    onDeleteImage,
    onDeletePost
}: ProfilePostDetailModalProps) => {
    const tags = getPostTags(selectedPost);
    const comments = selectedPost?.Comments || [];
    const [editingImages, setEditingImages] = useState(false);
    const [images, setImages] = useState<PostImage[]>(selectedPost?.images || []);

    useEffect(() => {
        setImages(selectedPost?.images || []);
        setEditingImages(false);
    }, [selectedPost]);

    const getPostId = () => selectedPost?._id || selectedPost?.idPost || '';

    const handleEditDescription = async () => {
        const postId = getPostId();
        if (!postId || !selectedPost) return;

        const newDescription = window.prompt('Editar descripción del post:', selectedPost.descripcion || '');
        if (newDescription === null) return;

        const trimmedDescription = newDescription.trim();
        if (!trimmedDescription) {
            alert('La descripción no puede estar vacía.');
            return;
        }

        if (onEditDescription) {
            await onEditDescription(postId, trimmedDescription);
        }
    };

    const handleAddImage = async () => {
        const postId = getPostId();
        if (!postId) return;

        const imageUrl = window.prompt('Ingrese la URL de la nueva imagen:');
        if (imageUrl === null) return;

        const trimmedUrl = imageUrl.trim();
        if (!trimmedUrl) {
            alert('La URL de la imagen no puede estar vacía.');
            return;
        }

        if (onAddImage) {
            const newImage = await onAddImage(postId, trimmedUrl);
            if (newImage) {
                setImages((prev) => [...prev, newImage]);
            }
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        const postId = getPostId();
        if (!postId || !imageId) return;

        if (!window.confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
            return;
        }

        if (onDeleteImage) {
            const deleted = await onDeleteImage(postId, imageId);
            if (deleted) {
                setImages((prev) => prev.filter((image) => image._id !== imageId));
            }
        }
    };

    const handleDeletePost = async () => {
        const postId = getPostId();
        if (!postId || !onDeletePost) return;

        await onDeletePost(postId);
        onHide();
    };

    const handleEditTags = async () => {
    const postId = getPostId();
    if (!postId || !selectedPost) return;

    // Obtener tags actuales como string separado por comas
    const currentTags = tags.map(t => typeof t === 'string' ? t : t.nombre).join(', ');
    const newTagsStr = window.prompt('Editar tags (separados por coma):', currentTags);
    
    if (newTagsStr === null) return;

    const newTags = newTagsStr.split(',').map(t => t.trim()).filter(t => t !== '');
    
    // Aquí llamarías a tu función onEditTags si la tienes definida en props
    // await onEditTags(postId, newTags); 
    alert(`Tags actualizados: ${newTags.join(', ')}`);
};

    return (
        <Modal show={show} onHide={onHide} size="lg" className="profile-post-modal">
            <Modal.Header closeButton>
                <Modal.Title>Detalle del Post</Modal.Title>
                {isOwnPost && (
                    <MoreOptionsMenu
                        className="profile-post-modal__options"
                        menuItems={[
                            {
                                label: 'Editar descripción',
                                icon: <Edit2 size={16} />,
                                onClick: handleEditDescription,
                                className: 'more-options-menu__item--edit'
                            },
                            {
                                label: 'Agregar foto',
                                icon: <ImagePlus size={16} />,
                                onClick: handleAddImage,
                                className: 'more-options-menu__item--add-image'
                            },
                            {
                                label: editingImages ? 'Cancelar eliminar fotos' : 'Eliminar fotos',
                                icon: <Trash2 size={16} />,
                                onClick: () => setEditingImages((prev) => !prev),
                                className: 'more-options-menu__item--delete'
                            },
                            {
                                label: 'Eliminar post',
                                icon: <Trash2 size={16} />,
                                onClick: handleDeletePost,
                                className: 'more-options-menu__item--delete'
                            }
                        ]}
                    />
                )}
            </Modal.Header>
            <Modal.Body>
                <Row className="profile-row">
                    {/* Columna de Imágenes */}
                    <Col className="col-images">
                        {selectedPost?.images && selectedPost.images.length > 0 ? (
                            <Carousel 
                                activeIndex={activeIndex} 
                                onSelect={(index) => onSelect(index)} 
                                interval={null}
                            >
                                {images.map((image, index) => (
                                <Carousel.Item key={image._id}>
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={`http://localhost:8080${image.url}`}
                                            className="d-block w-100"
                                            style={{ height: '400px', objectFit: 'contain', backgroundColor: '#000' }}
                                            alt="..."
                                        />
                                        {editingImages && (
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                style={{ position: 'absolute', top: '10px', right: '10px' }}
                                                onClick={() => handleDeleteImage(image._id || '')}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </Carousel.Item>
                            ))}
                            </Carousel>
                        ) : (
                            <div className="no-images-placeholder">
                                <p>No hay imágenes para mostrar</p>
                            </div>
                        )}
                    </Col>

                    {/* Columna de Contenido */}
                    <Col className="col-content">
                        {/* Descripción */}
                        {selectedPost?.descripcion && (
                            <div className="post-description">
                                {selectedPost.descripcion}
                            </div>
                        )}

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="post-tags">
                                {tags.map((tag, index) => (
                                    <span key={`${tag}-${index}`} className="post-tag">
                                        #{typeof tag === 'string' ? tag : tag.nombre}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Divisor */}
                        <div className="modal-divider"></div>

                        {/* Comentarios */}
                        <div className="comments-section">
                            <div className="comments-header">
                                Comentarios
                                <span className="comments-count">{comments.length}</span>
                            </div>

                            {comments.length > 0 ? (
                                <div className="comments-container">
                                    {comments.map((comment, index) => (
                                        <div 
                                            key={comment.idComment || comment._id || index} 
                                            className="comment-item"
                                        >
                                            <div className="comment-author">
                                                {getCommentAuthorName(comment)}
                                            </div>
                                            <div className="comment-content">
                                                {comment.contenido || 'Sin texto'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="comment-empty">
                                    No hay comentarios aún
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default ProfilePostDetailModal;
