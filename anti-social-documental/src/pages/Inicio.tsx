import { useState, useEffect } from "react"
import { Row, Col, Container } from "react-bootstrap"

import ButtonScroll from "../component/ButtonScroll"
import FeedPost from "../component/FeedPost"
import postServices from "../services/postServices"

const Inicio = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const postsData = await postServices.getPosts()
        // Ordenar de más nuevo a más antiguo
        const postsOrdenados = postsData.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        setPosts(postsOrdenados)
      } catch (err) {
        console.error("Error al cargar posts:", err)
        setError("Error al cargar los posts")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [refreshTrigger])

  const handlePostUpdated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handlePostDeleted = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  if (loading) return <Container><p>Cargando posts...</p></Container>
  if (error) return <Container><p style={{ color: "red" }}>{error}</p></Container>

  return (
    <Container fluid="md">
      <Row>
        <ButtonScroll />
      </Row>

      <Row>
        <Col>
          {posts.length > 0 ? (
            posts.map((post) => (
              <FeedPost 
                key={post.idPost} 
                dataPost={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))
          ) : (
            <p>No hay posts disponibles</p>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default Inicio
