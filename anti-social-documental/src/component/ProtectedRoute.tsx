import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const usuario = localStorage.getItem('usuario')
  
  if (!usuario) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

export default ProtectedRoute
