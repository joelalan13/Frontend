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

type ProfilePostTextCardProps = {
    post: Post;
    onClick: () => void;
    getPostTags: (post: Post | null | undefined) => string[];
    isOwnPost?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
};

const ProfilePostTextCard = ({ post, onClick, getPostTags, isOwnPost = false, onEdit, onDelete }: ProfilePostTextCardProps) => {
    return (
        <Card
            className="profile-post-text-card"
            style={{ position: 'relative', cursor: 'pointer', overflow: 'visible' }}
            onClick={onClick}
        >
            {isOwnPost && (
                <MoreOptionsMenu
                    className="profile-post-text-card__options"
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
