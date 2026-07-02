import { Routes, Route, useLocation } from "react-router-dom"
import { useMemo } from "react"

import Header from "./component/Header"
import Footer from "./component/Footer"
import ProtectedRoute from "./component/ProtectedRoute"
import Inicio from "./pages/Inicio"
import Perfil from "./pages/Perfil"
import PerfilUsuario from "./pages/PerfilUsuario"
import Login from "./component/Login"
import Register from "./component/RegisterForm"
import NewPost from "./pages/NewPost"
import PostDetails from "./pages/PostDetails"
import Error404 from "./pages/Error404"
import { ROUTES } from "./constants"

type Screen = "home" | "login" | "register" | "profile" | "create" | "post"

function App() {
  const location = useLocation()

  // Determinar screen actual basado en la ruta
  const screen: Screen = useMemo(() => {
    const path = location.pathname
    if (path === "/" || path === "/inicio") return "home"
    if (path === "/login") return "login"
    if (path === "/register") return "register"
    if (path === "/perfil") return "profile"
    if (path === "/newPost") return "create"
    return "post"
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('usuario')
  }

  const showHeader = true

  return (
    <div>
      {showHeader && <Header screen={screen} onLogout={handleLogout} />}
      <Routes>
        {/* Rutas públicas */}
        <Route path={ROUTES.HOME} element={<Inicio />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        
        {/* Rutas protegidas */}
        <Route 
          path={ROUTES.PROFILE} 
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.PROFILE_USER} 
          element={
            <ProtectedRoute>
              <PerfilUsuario />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.NEW_POST} 
          element={
            <ProtectedRoute>
              <NewPost />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.POST_DETAILS} 
          element={
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta 404 */}
        <Route path="/notFound" element={<Error404 />} />
      </Routes>
    </div>
  )
}

export default App
