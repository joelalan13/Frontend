import { useState, useEffect } from "react"
import { MoreVertical, Bookmark, ThumbsUp, MessageCircle, Trash2, Edit2, X, Check } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import type { Post, PostImage, User } from "../types"
import usuarioServices from "../services/usuarioServices"
import postServices from "../services/postServices"
import postImageServices from "../services/postImageServices"
import { getAvatarColor } from "../utils/getAvatarColor"
// @ts-ignore: allow importing CSS without type declarations
import "../styles/feedpost.css"

interface FeedPostProps {
  dataPost: Post
  onPostDeleted?: () => void
  onPostUpdated?: () => void
}

const FeedPost = ({ dataPost, onPostDeleted, onPostUpdated }: FeedPostProps) => {
  const [likes, setLikes] = useState<number>(dataPost.likes || 0)
  const [yaClickeado, setYaClickeado] = useState<boolean>(false)
  const [userData, setUserData] = useState<User | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [showMenu, setShowMenu] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editingDescription, setEditingDescription] = useState(dataPost.descripcion)
  const [saving, setSaving] = useState(false)
  const [editingImages, setEditingImages] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [images, setImages] = useState<PostImage[]>(dataPost.images || [])
  const apiUrl: string = import.meta.env.VITE_API_URL || "http://localhost:8080"
  const navigate = useNavigate()

  // Cargar datos del usuario actual
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  // Cargar datos del usuario del post
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (dataPost.idUser) {
          const user = await usuarioServices.getUsuarioById(dataPost.idUser as string)
          setUserData(user)
        }
      } catch (err) {
        console.error("Error al cargar usuario:", err)
      }
    }

    fetchUserData()
  }, [dataPost.idUser])

  const handleLike = (): void => {
    !yaClickeado ? setLikes((prev) => prev + 1) : setLikes((prev) => prev - 1)
    setYaClickeado(!yaClickeado)
  }

  const handleUserClick = (): void => {
    navigate(`/perfil/${dataPost.idUser}`)
  }

  const handleDeletePost = async (): void => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este post?")) {
      return
    }

    setDeleting(true)
    try {
      await postServices.deletePost(dataPost.idPost)
      alert("Post eliminado exitosamente")
      setShowMenu(false)
      if (onPostDeleted) {
        onPostDeleted()
      }
    } catch (err) {
      console.error("Error al eliminar post:", err)
      alert("Error al eliminar el post")
    } finally {
      setDeleting(false)
    }
  }

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingDescription.trim()) {
      alert("La descripción no puede estar vacía")
      return
    }

    setSaving(true)
    try {
      await postServices.putPost(
        {
          idUser: dataPost.idUser as string,
          descripcion: editingDescription,
        },
        dataPost.idPost
      )
      alert("Post actualizado exitosamente")
      setEditing(false)
      setShowMenu(false)
      if (onPostUpdated) {
        onPostUpdated()
      }
    } catch (err) {
      console.error("Error al editar post:", err)
      alert("Error al editar el post")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteImage = async (imageId: string): Promise<void> => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta foto?")) {
      return
    }

    setDeletingImageId(imageId)
    try {
      await postImageServices.deleteImageDePost(dataPost.idPost, imageId)
      setImages(images.filter((img) => img._id !== imageId))
      alert("Foto eliminada exitosamente")
    } catch (err) {
      console.error("Error al eliminar foto:", err)
      alert("Error al eliminar la foto")
    } finally {
      setDeletingImageId(null)
    }
  }

  const isOwnPost = currentUser && (currentUser._id === dataPost.idUser || currentUser.idUser === dataPost.idUser)

  const cantComentarios: number = dataPost.Comments?.length || 0

  // Función para obtener el nombre del tag (si es objeto o string)
  const getTagName = (tag: string | { nombre: string }): string => {
    return typeof tag === 'string' ? tag : tag.nombre
  }

  // Función para obtener la key del tag
  const getTagKey = (tag: string | { idTag: number }): string | number => {
    return typeof tag === 'string' ? tag : tag.idTag
  }

  // Función para construir URL completa de imagen
  const getImageUrl = (img: PostImage | string): string => {
    if (typeof img === 'string') return img
    if (img.url.startsWith('http')) return img.url
    return `${apiUrl}${img.url}`
  }

  // Función para obtener iniciales del usuario
  const getInitials = (): string => {
    if (!userData) return "U"
    const nombre = userData.nombre?.charAt(0).toUpperCase() || ""
    const apellido = userData.apellido?.charAt(0).toUpperCase() || ""
    return nombre + apellido
  }

  // Función para calcular tiempo relativo
  const getRelativeTime = (): string => {
    if (!dataPost.createdAt) return "Hace poco"
    
    const createdDate = new Date(dataPost.createdAt)
    const now = new Date()
    const diffMs = now.getTime() - createdDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Justo ahora"
    if (diffMins < 60) return `Hace ${diffMins}m`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 7) return `Hace ${diffDays}d`
    
    return createdDate.toLocaleDateString('es-ES')
  }

  const avatarColor = getAvatarColor(dataPost.idUser as string)

  // Preparar slides para el lightbox
  const slides = images?.map((img) => ({
    src: getImageUrl(img),
    alt: "Post image"
  })) || []

  return (
    <>
      <article className="feedpost">
        {/* Header del post */}
        <div className="feedpost__header">
          {/* Avatar y info */}
          <div className="feedpost__user-info">
            <button 
              className="feedpost__avatar"
              style={{ backgroundColor: avatarColor, border: "none", cursor: "pointer" }}
              onClick={handleUserClick}
              title="Ver perfil"
            >
              {getInitials()}
            </button>
            <div className="feedpost__user-details">
              <h3 
                className="feedpost__username"
                style={{ cursor: "pointer" }}
                onClick={handleUserClick}
                title="Ver perfil"
              >
                {userData 
                  ? `${userData.nombre} ${userData.apellido}` 
                  : "Cargando..."}
              </h3>
              <p className="feedpost__user-meta">
                {userData?.nickName || "Usuario"} · {getRelativeTime()}
              </p>
            </div>
          </div>

          {/* Botones de menu */}
          <div className="feedpost__actions">
            <button className="feedpost__action-btn" title="Guardar">
              <Bookmark size={18} />
            </button>
            <div style={{ position: "relative" }}>
              <button 
                className="feedpost__action-btn" 
                title="Más opciones"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical size={18} />
              </button>
              
              {showMenu && isOwnPost && (
                <div style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "4px",
                  minWidth: "150px",
                  zIndex: 10
                }}>
                  <button
                    onClick={() => setEditing(true)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#ffb700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2a2a2a"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <Edit2 size={16} />
                    Editar descripción
                  </button>
                  <button
                    onClick={() => setEditingImages(true)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#ffb700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2a2a2a"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <Edit2 size={16} />
                    Eliminar fotos
                  </button>
                  <button
                    onClick={handleDeletePost}
                    disabled={deleting}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#ff6b6b",
                      cursor: deleting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2a2a2a"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <Trash2 size={16} />
                    {deleting ? "Eliminando..." : "Eliminar post"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Descripción o Editor */}
        {editing ? (
          <div className="feedpost__content" style={{ padding: "15px" }}>
            <textarea
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "10px",
                backgroundColor: "#222",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "4px",
                fontFamily: "inherit",
                fontSize: "14px",
                resize: "vertical"
              }}
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#00ff00",
                  color: "#000",
                  border: "none",
                  borderRadius: "4px",
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                <Check size={16} />
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setEditingDescription(dataPost.descripcion)
                }}
                disabled={saving}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "14px"
                }}
              >
                <X size={16} />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="feedpost__content">
            <p className="feedpost__description">{dataPost.descripcion}</p>
          </div>
        )}

        {/* Tags */}
        {dataPost.tags && dataPost.tags.length > 0 && (
          <div className="feedpost__tags">
            {dataPost.tags.map((tag) => (
              <span key={getTagKey(tag)} className="feedpost__tag">
                #{getTagName(tag)}
              </span>
            ))}
          </div>
        )}

        {/* Imágenes - Modo Normal o Modo Eliminar */}
        {images && images.length > 0 && (
          <div
            className={`feedpost__images ${images.length === 1
                ? "feedpost__images--single"
                : "feedpost__images--multiple"
              }`}
          >
            {images.map((img, idx) => (
              <div key={img._id} style={{ position: "relative" }}>
                <img
                  src={getImageUrl(img)}
                  alt="Post"
                  className="feedpost__image"
                  style={{ cursor: editingImages ? "default" : "pointer" }}
                  onClick={() => !editingImages && setLightboxIndex(idx)}
                  title={editingImages ? "Modo eliminar" : "Click para ver a tamaño completo"}
                />
                {editingImages && isOwnPost && (
                  <button
                    onClick={() => handleDeleteImage(img._id)}
                    disabled={deletingImageId === img._id}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#ff6b6b",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      cursor: deletingImageId === img._id ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: deletingImageId === img._id ? 0.6 : 1
                    }}
                    title="Eliminar foto"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {editingImages && (
          <div style={{ padding: "15px", backgroundColor: "#1a1a1a", borderTop: "1px solid #333" }}>
            <button
              onClick={() => setEditingImages(false)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#333",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px"
              }}
            >
              <Check size={16} />
              Listo
            </button>
          </div>
        )}

        {/* Footer con acciones */}
        <div className="feedpost__footer">
          <div className="feedpost__stats">
            <span className="feedpost__stat">
              <span className="feedpost__stat-icon"> <ThumbsUp size={14} /></span>
              {likes}
            </span>
            <span className="feedpost__stat">
              {cantComentarios} comentarios
            </span>
          </div>

          {/* Botones de acción */}
          <div className="feedpost__buttons">
            <button
              className={`feedpost__btn ${yaClickeado ? "feedpost__btn--active" : ""}`}
              onClick={handleLike}
            >
              <ThumbsUp size={16} />
              Me gusta
            </button>
            <Link
              to={`/postDetails/${dataPost.idPost}`}
              className="feedpost__btn"
            >
              <MessageCircle size={16} />
              Comentar
            </Link>
            <Link
              to={`/perfil/${dataPost.idUser}`}
              className="feedpost__btn feedpost__btn--primary"
            >
              Ver más →
            </Link>
          </div>
        </div>
      </article>

      {/* Lightbox para ver imágenes */}
      <Lightbox
        slides={slides}
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
      />
    </>
  )
}

export default FeedPost
