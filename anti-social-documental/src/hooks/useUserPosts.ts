import { useState, useEffect } from 'react'
import axios from 'axios'
import type { Post, User } from '../types'
import { API_URL } from '../constants'

export const useUserPosts = (user: User | null) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchUserPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(`${API_URL}/posts`)
        // Filtrar solo posts del usuario
        const userPosts = Array.isArray(response.data)
          ? response.data.filter((post) => post.idUser === user._id || post.idUser === user.idUser)
          : []
        setPosts(userPosts)
      } catch (err) {
        console.error('Error al cargar posts:', err)
        setError('No se pudieron cargar los posts')
      } finally {
        setLoading(false)
      }
    }

    fetchUserPosts()
  }, [user?._id, user?.idUser])

  return { posts, loading, error, setPosts }
}
