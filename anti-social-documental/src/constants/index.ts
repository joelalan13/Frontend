// URL y configuración de API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/perfil',
  PROFILE_USER: '/perfil/:userId',
  NEW_POST: '/newPost',
  POST_DETAILS: '/postDetails/:idPost',
} as const

// Mensajes de error
export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión. Por favor, intenta de nuevo.',
  NOT_FOUND: 'Recurso no encontrado.',
  UNAUTHORIZED: 'No tienes permisos para esta acción.',
  SERVER: 'Error del servidor. Por favor, intenta más tarde.',
} as const

// Textos generales
export const LABELS = {
  HOME: 'Home',
  CREATE: 'Crear',
  PROFILE: 'Perfil',
  LOGOUT: 'Cerrar sesión',
  LOGIN: 'Login',
  REGISTER: 'Registro',
  SUGGESTIONS: 'Sugerencia',
  FOLLOWING: 'Seguidos',
  IMAGES: 'Imágenes',
  POSTS: 'Posts',
  COMMENTS: 'Comentarios',
} as const
