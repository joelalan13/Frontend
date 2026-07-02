import { Card } from 'react-bootstrap';
import '../styles/profilePostCards.css';

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
            className="profile-post-text-card"
            onClick={onClick}
        >
            <Card.Body>
                <Card.Text>
                    {post.descripcion}
                </Card.Text>

                {getPostTags(post).length > 0 && (
                    <div className="d-flex flex-wrap mb-2">
                        {getPostTags(post).map((tag: any, index: number) => (
                            <span
                                key={`${tag}-${index}`}
                                className="badge"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <small className="text-muted d-block">
                    Publicado el: {new Date(post.createdAt || '').toLocaleDateString()}
                </small>
            </Card.Body>
        </Card>
    );
};

export default ProfilePostTextCard;
