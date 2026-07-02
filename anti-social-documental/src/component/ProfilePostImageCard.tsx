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

type ProfilePostImageCardProps = {
    post: Post;
    onClick: () => void;
};

const ProfilePostImageCard = ({ post, onClick }: ProfilePostImageCardProps) => {
    return (
        <Card 
            className="profile-post-card h-100" 
            style={{ cursor: 'pointer' }} 
            onClick={onClick}
        >
            <Card.Img
                variant="top"
                src={`http://localhost:8080${post.images?.[0]?.url}`}
                style={{ height: '220px', objectFit: 'cover' }}
            />
            {post.images && post.images.length > 1 && (
                <Card.Footer>
                    {post.images.length} imágenes
                </Card.Footer>
            )}
        </Card>
    );
};

export default ProfilePostImageCard;
