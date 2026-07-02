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

type ProfilePostImageCardProps = {
    post: Post;
    onClick: () => void;
};

const ProfilePostImageCard = ({ post, onClick }: ProfilePostImageCardProps) => {
    return (
        <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={onClick}>
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
    );
};

export default ProfilePostImageCard;
