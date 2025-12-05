import React from 'react';

interface ProfileHeaderProps {
  fullName: string;
  username: string;
  avatarUrl?: string;
  onAvatarClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  username,
  avatarUrl,
  onAvatarClick
}) => {
  return (
    <div className="profile-header">
      <div className="avatar-container">
        <div className="avatar" id="avatarWrapper" onClick={onAvatarClick}>
          {avatarUrl ? (
            <img
              id="avatarImage"
              src={avatarUrl}
              alt="Foto de perfil"
              style={{ display: 'block' }}
            />
          ) : (
            <i className="fas fa-user" id="avatarIcon"></i>
          )}
          <div className="avatar-edit-overlay" id="avatarEditOverlay">
            <i className="fas fa-camera"></i>
          </div>
        </div>
      </div>
      <div className="profile-info">
        <h1 className="profile-name" id="displayName">
          {fullName}
        </h1>
        <p className="profile-username">{username}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
