import { useState } from "react"
// @ts-ignore
import "../styles/buttonscroll.css"

interface ButtonScrollProps {
  onTabChange?: (activo: boolean) => void
}

const ButtonScroll = ({ onTabChange }: ButtonScrollProps) => {
  const [activo, setActivo] = useState(true)

  const handleSetActivo = (value: boolean) => {
    setActivo(value)
    if (onTabChange) {
      onTabChange(value)
    }
  }

  return (
    <div className="buttonscroll">
      <button
        className={`buttonscroll__btn ${activo ? "buttonscroll__btn--active" : ""}`}
        onClick={() => handleSetActivo(true)}
      >
        Sugerencia
      </button>
      <button
        className={`buttonscroll__btn ${!activo ? "buttonscroll__btn--active" : ""}`}
        onClick={() => handleSetActivo(false)}
      >
        Seguidos
      </button>
    </div>
  )
}

export default ButtonScroll
