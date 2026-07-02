import { useState, useEffect, useMemo } from "react"
import { Row, Col, Container } from "react-bootstrap"
import { API_URL } from "../constants"
import { filterRecentPosts } from "../utils/dateFilters"

import ButtonScroll from "../component/ButtonScroll"
import TagFilterDropdown from "../component/TagFilterDropdown"
import FeedPost from "../component/FeedPost"
import postServices from "../services/postServices"

const Inicio = () => {
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([])

  // Cargar usuario logeado desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  // Cargar todos los posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const postsData = await postServices.getPosts()
        // Filtrar posts de menos de 6 meses
        const recentPosts = filterRecentPosts(postsData)
        // Ordenar de más nuevo a más antiguo
        const postsOrdenados = recentPosts.sort((a, b) => {
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

  // Extraer tags únicos de todos los posts
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach(post => {
      if ((post as any).tags && Array.isArray((post as any).tags)) {
        (post as any).tags.forEach((tag: any) => {
          const tagName = typeof tag === 'string' ? tag : (tag as any).nombre
          if (tagName) tagSet.add(tagName)
        })
      }
    })
    return Array.from(tagSet).sort()
  }, [posts])

  // Filtrar posts según la pestaña activa y tags seleccionados
  useEffect(() => {
    let filtered = posts

    // Primero filtrar por pestaña (Todos/Seguidos)
    if (!showSuggestions) {
      if (currentUser && currentUser.following) {
        const followingIds = Array.isArray(currentUser.following)
          ? currentUser.following.map((item: any) => {
              if (typeof item === 'string') return item
              return item._id || item.id
            })
          : []

        filtered = posts.filter((post) => 
          followingIds.includes(post.idUser)
        )
      } else {
        filtered = []
      }
    }

    // Luego filtrar por tags si están seleccionados (AND lógico)
    if (selectedFilterTags.length > 0) {
      filtered = filtered.filter(post => 
        selectedFilterTags.every((selectedTag: string) =>
          (post as any).tags?.some((tag: any) => {
            const tagName = typeof tag === 'string' ? tag : tag.nombre
            return tagName === selectedTag
          })
        )
      )
    }

    setFilteredPosts(filtered)
  }, [showSuggestions, posts, currentUser, selectedFilterTags])

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
        <ButtonScroll onTabChange={setShowSuggestions} />
      </Row>

      <Row>
        <Col className="mt-3">
          <TagFilterDropdown 
            tags={availableTags}
            selectedTags={selectedFilterTags}
            onTagSelect={setSelectedFilterTags}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <FeedPost 
                key={post.idPost} 
                dataPost={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))
          ) : (
            <p>{showSuggestions ? "No hay posts disponibles" : "No estás siguiendo a ningún usuario o no hay posts de usuarios que sigas"}</p>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default Inicio
