import { Col, Carousel, Modal, Row } from 'react-bootstrap';
import '../styles/profilePostDetailModal.css';

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

type ProfilePostDetailModalProps = {
    show: boolean;
    onHide: () => void;
    selectedPost: Post | null;
    activeIndex: number;
    onSelect: (index: number) => void;
    getPostTags: (post: Post | null | undefined) => string[];
    getCommentAuthorName: (comment: any) => string;
};

const ProfilePostDetailModal = ({
    show,
    onHide,
    selectedPost,
    activeIndex,
    onSelect,
    getPostTags,
    getCommentAuthorName
}: ProfilePostDetailModalProps) => {
    const tags = getPostTags(selectedPost);
    const comments = selectedPost?.Comments || [];

    return (
        <Modal show={show} onHide={onHide} size="lg" className="profile-post-modal">
            <Modal.Header closeButton>
                <Modal.Title>Detalle del Post</Modal.Title>
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
                                {selectedPost.images.map((image, index) => (
                                    <Carousel.Item key={image._id || `${image.url}-${index}`}>
                                        <img
                                            src={`http://localhost:8080${image.url}`}
                                            className="d-block w-100"
                                            style={{ 
                                                height: '420px', 
                                                objectFit: 'cover',
                                                borderRadius: '6px'
                                            }}
                                            alt={`Imagen ${index + 1}`}
                                        />
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
                                        #{typeof tag === 'string' ? tag : tag?.nombre || 'tag'}
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
