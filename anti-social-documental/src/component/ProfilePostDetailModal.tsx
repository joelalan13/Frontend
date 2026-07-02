import { Col, Carousel, Modal, Row } from 'react-bootstrap';

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
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Detalle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={7}>
                        {selectedPost?.images && selectedPost.images.length > 0 ? (
                            <Carousel activeIndex={activeIndex} onSelect={(index) => onSelect(index)} interval={null}>
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
    );
};

export default ProfilePostDetailModal;
