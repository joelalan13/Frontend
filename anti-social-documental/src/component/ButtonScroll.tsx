import { useState } from "react"
// @ts-ignore
import "../styles/buttonscroll.css"

const ButtonScroll = () => {
  const [activo, setActivo] = useState(true)

  return (
    <div className="buttonscroll">
      <button
        className={`buttonscroll__btn ${activo ? "buttonscroll__btn--active" : ""}`}
        onClick={() => setActivo(true)}
      >
        Sugerencia
      </button>
      <button
        className={`buttonscroll__btn ${!activo ? "buttonscroll__btn--active" : ""}`}
        onClick={() => setActivo(false)}
      >
        Seguidos
      </button>
    </div>
  )
}

export default ButtonScroll
