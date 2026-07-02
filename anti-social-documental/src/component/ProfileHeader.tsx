import { Button, Image, Form } from 'react-bootstrap';
import { Camera } from 'lucide-react';
import { API_URL } from '../constants';
import '../styles/profileFormStyles.css';

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
    isOtherUserProfile?: boolean;
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
    isOtherUserProfile = false,
}: ProfileHeaderProps) => {
    return (
        <div className="d-flex flex-column align-items-center mb-4">
            <div className="position-relative">
                {!isOtherUserProfile && (
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: 'none' }}
                        onChange={onFileChange}
                    />
                )}
                <div className="position-relative d-inline-block">
                    <Image
                        key={user?._id || 'profile'}
                        src={getProfileImageSrc(user?.fotoPerfil)}
                        roundedCircle
                        width={150}
                        height={150}
                        style={{ 
                            objectFit: 'cover',
                            border: '3px solid #00D166'
                        }}
                        onError={onProfileImageError}
                        onLoad={onProfileImageLoad}
                    />
                    {!isOtherUserProfile && (
                        <Button
                            variant="secondary"
                            className="position-absolute bottom-0 end-0 rounded-circle"
                            onClick={() => document.getElementById('fileInput')?.click()}
                            style={{
                                background: '#00D166',
                                border: 'none',
                                width: '44px',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0
                            }}
                        >
                            <Camera size={20} color="#030A04" />
                        </Button>
                    )}
                </div>
            </div>

            <h2 className="mt-3" style={{ color: '#EDFAEE' }}>{user?.nickName}</h2>
            <p style={{ color: '#7d8d81', margin: 0 }}>{user?.nombre} {user?.apellido}</p>

            <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
                <div style={{
                    border: '1px solid #243224',
                    borderRadius: '6px',
                    padding: '1rem 1.5rem',
                    minWidth: '180px',
                    textAlign: 'center',
                    background: '#111812'
                }}>
                    <div>
                        <strong style={{ color: '#00D166', fontSize: '1.25rem' }}>
                            {getRelationshipCount(user?.followers)}
                        </strong>
                        <div style={{ color: '#7d8d81', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            Seguidores
                        </div>
                    </div>
                </div>
                <div style={{
                    border: '1px solid #243224',
                    borderRadius: '6px',
                    padding: '1rem 1.5rem',
                    minWidth: '180px',
                    textAlign: 'center',
                    background: '#111812'
                }}>
                    <div>
                        <strong style={{ color: '#00D166', fontSize: '1.25rem' }}>
                            {getRelationshipCount(user?.following)}
                        </strong>
                        <div style={{ color: '#7d8d81', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            Seguidos
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column align-items-center gap-3 mt-4" style={{ maxWidth: '360px', width: '100%' }}>
                {isOtherUserProfile ? (
                    <button
                        className={`profile-btn-follow ${isFollowingTarget ? 'is-following' : ''}`}
                        onClick={onFollowToggle}
                        disabled={followLoading}
                        style={{ width: '100%' }}
                    >
                        {followLoading ? '...' : isFollowingTarget ? 'Dejar de seguir' : 'Seguir'}
                    </button>
                ) : (
                    <div className="profile-search-container">
                        <Form.Control
                            className="profile-input"
                            placeholder="Nickname del usuario"
                            value={targetUserId}
                            onChange={(e) => onTargetUserIdChange(e.target.value)}
                        />
                        <button
                            className="profile-btn-follow"
                            onClick={onFollowToggle}
                            disabled={followLoading || !targetUserId || targetUserId.toLowerCase() === user?.nickName?.toLowerCase()}
                        >
                            {followLoading ? '...' : isFollowingTarget ? 'Dejar de seguir' : 'Seguir'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;