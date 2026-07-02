import { Card } from 'react-bootstrap';

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

type ProfilePostTextCardProps = {
    post: Post;
    onClick: () => void;
    getPostTags: (post: Post | null | undefined) => string[];
};

const ProfilePostTextCard = ({ post, onClick, getPostTags }: ProfilePostTextCardProps) => {
    return (
        <Card
            className="mb-3 p-3 border-0 shadow-sm"
            style={{
                width: '100%',
                maxWidth: '600px',
                borderRadius: '12px',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer'
            }}
            onClick={onClick}
        >
            <Card.Body>
                <Card.Text style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
                    {post.descripcion}
                </Card.Text>

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
    );
};

export default ProfilePostTextCard;
