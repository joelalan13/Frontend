import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit2, X, Check } from "lucide-react";
import type { Comment as CommentType, User } from "../types";
import usuarioServices from "../services/usuarioServices";
import commentServices from "../services/commentServices";
import { getAvatarColor } from "../utils/getAvatarColor";
import { API_URL } from "../constants";
import "../styles/comment.css";

type Props = {
  comment: CommentType;
  idPost?: string;
  onCommentDeleted?: () => void;
  onCommentUpdated?: () => void;
};

const Comment = ({ comment, idPost, onCommentDeleted, onCommentUpdated }: Props) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingContent, setEditingContent] = useState(comment.contenido);
  const [saving, setSaving] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = typeof comment.idUser === 'string' 
          ? comment.idUser 
          : (comment.idUser as any)?._id || (comment.idUser as any)?.idUser;

        if (userId) {
          const user = await usuarioServices.getUsuarioById(userId);
          setUserData(user);
        }
      } catch (err) {
      }
    };

    fetchUserData();
  }, [comment.idUser]);

  const getInitials = (): string => {
    if (!userData) return "U";
    const nombre = userData.nombre?.charAt(0).toUpperCase() || "";
    const apellido = userData.apellido?.charAt(0).toUpperCase() || "";
    return nombre + apellido;
  };

  const getProfileImageUrl = (): string | null => {
    if (!userData?.fotoPerfil || profileImageError) return null;
    if (userData.fotoPerfil.startsWith('http://') || userData.fotoPerfil.startsWith('https://')) return userData.fotoPerfil;
    if (userData.fotoPerfil.startsWith('/')) return `${API_URL}${userData.fotoPerfil}`;
    return `${API_URL}/${userData.fotoPerfil}`;
  };

  const getRelativeTime = (): string => {
    if (!comment.createdAt) return "Hace poco";
    const createdDate = new Date(comment.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Justo ahora";
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return createdDate.toLocaleDateString("es-ES");
  };

  const handleDeleteComment = async (): Promise<void> => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
      return;
    }

    if (!idPost) {
      alert("Error: No se puede eliminar el comentario");
      return;
    }

    setDeleting(true);
    try {
      await commentServices.deleteComentario(idPost, comment._id || comment.idComment);
      alert("Comentario eliminado exitosamente");
      setShowMenu(false);
      if (onCommentDeleted) {
        onCommentDeleted();
      }
    } catch (err) {
      alert("Error al eliminar el comentario");
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingContent.trim()) {
      alert("El comentario no puede estar vacío");
      return;
    }

    if (!idPost) {
      alert("Error: No se puede editar el comentario");
      return;
    }

    setSaving(true);
    try {
      await commentServices.putComentario(editingContent, idPost, comment._id || comment.idComment);
      alert("Comentario actualizado exitosamente");
      setEditing(false);
      setShowMenu(false);
      if (onCommentUpdated) {
        onCommentUpdated();
      }
    } catch (err) {
      alert("Error al editar el comentario");
    } finally {
      setSaving(false);
    }
  };

  const userId = typeof comment.idUser === 'string' 
    ? comment.idUser 
    : (comment.idUser as any)?._id || (comment.idUser as any)?.idUser;
  
  const avatarColor = getAvatarColor(userId);
  const isOwnComment = currentUser && (currentUser._id === userId || currentUser.idUser === userId);

  const handleUserClick = () => {
    if (isOwnComment) {
      navigate('/perfil');
    } else if (userId) {
      navigate(`/perfil/${userId}`);
    }
  };

  return (
    <article className="comment">
      <button 
        className="comment__avatar"
        style={{
          backgroundColor: avatarColor,
          backgroundImage: getProfileImageUrl() ? `url(${getProfileImageUrl()})` : 'none',
        }}
        onClick={handleUserClick}
        onError={() => setProfileImageError(true)}
        title="Ver perfil"
      >
        {!getProfileImageUrl() && getInitials()}
      </button>

      <div className="comment__body">
        <div className="comment__header">
          <span 
            className="comment__user"
            onClick={handleUserClick}
            title="Ver perfil"
          >
            {userData ? `${userData.nombre} ${userData.apellido}` : "Cargando..."}
          </span>

          <span className="comment__time">
            {getRelativeTime()}
          </span>

          {isOwnComment && (
            <div style={{ position: "relative" }}>
              <button
                className="comment__menu-btn"
                onClick={() => setShowMenu(!showMenu)}
                title="Más opciones"
              >
                •••
              </button>

              {showMenu && (
                <div className="comment__menu">
                  <button
                    className="comment__menu-item"
                    onClick={() => setEditing(true)}
                  >
                    <Edit2 size={14} />
                    Editar
                  </button>
                  <button
                    className="comment__menu-item comment__menu-item--delete"
                    onClick={handleDeleteComment}
                    disabled={deleting}
                  >
                    <Trash2 size={14} />
                    {deleting ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {editing ? (
          <div className="comment__editor">
            <textarea
              className="comment__textarea"
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
            />
            <div className="comment__editor-buttons">
              <button
                className="comment__btn-save"
                onClick={handleSaveEdit}
                disabled={saving}
              >
                <Check size={14} />
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button
                className="comment__btn-cancel"
                onClick={() => {
                  setEditing(false);
                  setEditingContent(comment.contenido);
                }}
                disabled={saving}
              >
                <X size={14} />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p className="comment__text">
            {comment.contenido}
          </p>
        )}
      </div>
    </article>
  );
};

export default Comment;
