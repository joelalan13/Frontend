import { useState } from "react"
import { MoreVertical, Bookmark, ThumbsUp, MessageCircle } from "lucide-react"
import { Link } from "react-router-dom"
import type { Post } from "../types"
// @ts-ignore: allow importing CSS without type declarations
import "../styles/feedpost.css"

type FeedPostProps = {
  dataPost: Post & {
    likes?: number
    nombre?: string
    rol?: string
    tiempo?: string
    info?: string
  }
}

const FeedPost = ({ dataPost }: FeedPostProps) => {
  const [likes, setLikes] = useState(dataPost.likes || 0)
  const [yaClickeado, setYaClickeado] = useState(false)

  const handleLike = () => {
    !yaClickeado ? setLikes((prev) => prev + 1) : setLikes((prev) => prev - 1)
    setYaClickeado(!yaClickeado)
  }

  const cantComentarios = dataPost.Comments?.length || 0

  // Función para obtener el nombre del tag (si es objeto o string)
  return (
    <article className="feedpost">
      {/* Header del post */}
      <div className="feedpost__header">
        {/* Avatar y info */}
        <div className="feedpost__user-info">
          <div className="feedpost__avatar">
            {dataPost.nombre?.charAt(0).toUpperCase()}
          </div>
          <div className="feedpost__user-details">
            <h3 className="feedpost__username">{dataPost.nombre}</h3>
            <p className="feedpost__user-meta">
              {dataPost.rol || "Usuario"} · {dataPost.tiempo || "Hace 2h"}
            </p>
          </div>
        </div>

        {/* Botones de menu */}
        <div className="feedpost__actions">
          <button className="feedpost__action-btn" title="Guardar">
            <Bookmark size={18} />
          </button>
          <button className="feedpost__action-btn" title="Más opciones">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Descripción */}
      <div className="feedpost__content">
        <p className="feedpost__description">{dataPost.info}</p>
      </div>

      {/* Tags */}
      {dataPost.tags && dataPost.tags.length > 0 && (
        <div className="feedpost__tags">
          {dataPost.tags.map((tag) => (
            <span key={tag} className="feedpost__tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Imágenes */}
      {dataPost.images && dataPost.images.length > 0 && (
        <div
          className={`feedpost__images ${dataPost.images.length === 1
              ? "feedpost__images--single"
              : "feedpost__images--multiple"
            }`}
        >
          {dataPost.images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt="Post"
              className="feedpost__image"
            />
          ))}
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
            to={`/postDetails/${dataPost.idPost}`}
            className="feedpost__btn feedpost__btn--primary"
          >
            Ver más →
          </Link>
        </div>
      </div>
    </article>
  )
}

export default FeedPost
