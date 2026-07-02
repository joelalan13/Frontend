import { Button, Image, Form } from 'react-bootstrap';
import { Camera } from 'lucide-react';

type ProfileHeaderProps = {
    user: {
        _id?: string;
        nickName?: string;
        nombre?: string;
        apellido?: string;
        fotoPerfil?: string;
        followers?: any;
        following?: any;
    } | null;
    targetUserId: string;
    targetUserInfo: { _id?: string; nickName?: string; nombre?: string } | null;
    followLoading: boolean;
    isFollowingTarget: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFollowToggle: () => void;
    onTargetUserIdChange: (value: string) => void;
    getRelationshipCount: (value: any) => number;
    getProfileImageSrc: (fotoPerfil?: string) => string;
    onProfileImageError: () => void;
    onProfileImageLoad: () => void;
};

const ProfileHeader = ({
    user,
    targetUserId,
    targetUserInfo,
    followLoading,
    isFollowingTarget,
    onFileChange,
    onFollowToggle,
    onTargetUserIdChange,
    getRelationshipCount,
    getProfileImageSrc,
    onProfileImageError,
    onProfileImageLoad,
}: ProfileHeaderProps) => {
    return (
        <div className="d-flex flex-column align-items-center mb-4">
            <div className="position-relative">
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={onFileChange}
                />
                <div className="position-relative d-inline-block">
                    <Image
                        key={user?._id || 'profile'}
                        src={getProfileImageSrc(user?.fotoPerfil)}
                        roundedCircle
                        width={150}
                        height={150}
                        style={{ objectFit: 'cover' }}
                        onError={onProfileImageError}
                        onLoad={onProfileImageLoad}
                    />
                    <Button
                        variant="secondary"
                        className="position-absolute bottom-0 end-0 rounded-circle"
                        onClick={() => document.getElementById('fileInput')?.click()}
                    >
                        <Camera size={16} />
                    </Button>
                </div>
            </div>

            <h2 className="mt-3">{user?.nickName}</h2>
            <p className="text-muted">{user?.nombre} {user?.apellido}</p>

            <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
                <div className="border rounded px-3 py-2" style={{ minWidth: '180px' }}>
                    <div><strong>{getRelationshipCount(user?.followers)}</strong> Seguidores</div>
                </div>
                <div className="border rounded px-3 py-2" style={{ minWidth: '180px' }}>
                    <div><strong>{getRelationshipCount(user?.following)}</strong> Seguidos</div>
                </div>
            </div>

            <div className="d-flex flex-column align-items-center gap-2 mt-3" style={{ maxWidth: '360px', width: '100%' }}>
                <div className="d-flex gap-2 w-100">
                    <Form.Control
                        size="sm"
                        placeholder="Nickname del usuario"
                        value={targetUserId}
                        onChange={(e) => onTargetUserIdChange(e.target.value)}
                    />
                    <Button
                        size="sm"
                        variant={isFollowingTarget ? 'danger' : 'primary'}
                        onClick={onFollowToggle}
                        disabled={followLoading || !targetUserId || targetUserId.toLowerCase() === user?.nickName?.toLowerCase()}
                        style={{ minWidth: '140px', width: '140px', flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                        {followLoading ? '...' : isFollowingTarget ? 'Dejar de seguir' : 'Seguir'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
