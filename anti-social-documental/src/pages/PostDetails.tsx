import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"

import FeedPost from "../component/FeedPost"
import Comment from "../component/Comment"
import CommentForm from "../component/CommentForm"
import postServices from "../services/postServices"
import commentServices from "../services/commentServices"
import type { Post, Comment as CommentType } from "../types"

const PostDetails = () => {
  const { idPost } = useParams<{ idPost: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [comentarios, setComentarios] = useState<CommentType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Cargar post y comentarios
  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true)
      try {
        if (!idPost) return

        const postData = await postServices.getPostById(idPost)
        setPost(postData)

        const comentariosData = await commentServices.getComentariosDePost(idPost)
        setComentarios(comentariosData)
      } catch (err) {
        console.error("Error al cargar post o comentarios:", err)
        setError("Error al cargar el post")
      } finally {
        setLoading(false)
      }
    }

    fetchPostAndComments()
  }, [idPost])

  // Función para refrescar comentarios después de agregar uno
  const handleCommentAdded = async () => {
    try {
      if (!idPost) return
      const comentariosData = await commentServices.getComentariosDePost(idPost)
      setComentarios(comentariosData)
    } catch (err) {
      console.error("Error al refrescar comentarios:", err)
    }
  }

  // Función para refrescar comentarios después de eliminar uno
  const handleCommentDeleted = async () => {
    try {
      if (!idPost) return
      const comentariosData = await commentServices.getComentariosDePost(idPost)
      setComentarios(comentariosData)
    } catch (err) {
      console.error("Error al refrescar comentarios:", err)
    }
  }

  // Función para refrescar comentarios después de editar uno
  const handleCommentUpdated = async () => {
    try {
      if (!idPost) return
      const comentariosData = await commentServices.getComentariosDePost(idPost)
      setComentarios(comentariosData)
    } catch (err) {
      console.error("Error al refrescar comentarios:", err)
    }
  }

  // Función para refrescar el post después de editar
  const handlePostUpdated = async () => {
    try {
      if (!idPost) return
      const postData = await postServices.getPostById(idPost)
      setPost(postData)
    } catch (err) {
      console.error("Error al refrescar post:", err)
    }
  }

  // Función para refrescar después de eliminar post
  const handlePostDeleted = () => {
    // Redirigir al inicio después de eliminar
    window.location.href = "/"
  }

  if (loading) return <Container><p>Cargando post...</p></Container>
  if (error) return <Container><p style={{ color: "red" }}>{error}</p></Container>
  if (!post) return <Container><p>Post no encontrado</p></Container>

  return (
    <Container>
      <Row>
        <FeedPost 
          dataPost={post} 
          onPostDeleted={handlePostDeleted}
          onPostUpdated={handlePostUpdated}
        />
      </Row>

      <Row style={{ marginTop: "20px" }}>
        <Col>
          <h3>Comentarios ({comentarios.length})</h3>
          {comentarios.length > 0 ? (
            comentarios.map((comentario) => (
              <Comment 
                key={comentario.idComment} 
                comment={comentario}
                idPost={idPost}
                onCommentDeleted={handleCommentDeleted}
                onCommentUpdated={handleCommentUpdated}
              />
            ))
          ) : (
            <p>No hay comentarios aún</p>
          )}
        </Col>
      </Row>

      <Row style={{ marginTop: "20px" }}>
        <Col>
          <CommentForm idPost={idPost!} onCommentAdded={handleCommentAdded} />
        </Col>
      </Row>
    </Container>
  )
}

export default PostDetails
