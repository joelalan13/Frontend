import { Card } from 'react-bootstrap';
import { Trash2, Edit2 } from 'lucide-react';
import MoreOptionsMenu from './MoreOptionsMenu';
// @ts-ignore: allow importing CSS without type declarations
import '../styles/profilePostCards.css';

type PostImage = {
    _id?: string;
    url: string;
    createdAt?: string;
    updatedAt?: string;
};

type Post = {
    _id?: string;
    idPost?: string;
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
    isOwnPost?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
};

const ProfilePostImageCard = ({ post, onClick, isOwnPost = false, onEdit, onDelete }: ProfilePostImageCardProps) => {
    return (
        <Card 
            className="profile-post-card h-100" 
            style={{ cursor: 'pointer', position: 'relative', overflow: 'visible' }} 
            onClick={onClick}
        >
            {isOwnPost && (
                <MoreOptionsMenu
                    className="profile-post-card__options"
                    menuItems={[
                        {
                            label: 'Editar descripción',
                            icon: <Edit2 size={16} />,
                            onClick: () => onEdit?.(),
                            className: 'more-options-menu__item--edit'
                        },
                        {
                            label: 'Eliminar post',
                            icon: <Trash2 size={16} />,
                            onClick: () => onDelete?.(),
                            className: 'more-options-menu__item--delete'
                        }
                    ]}
                />
            )}

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
