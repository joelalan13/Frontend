import { useState } from "react";
import { Send } from "lucide-react";
// @ts-ignore: allow importing CSS without type declarations
import "../styles/commentForm.css";

type Props = {
  onSubmit?: (contenido: string) => void;
};

const CommentForm = ({ onSubmit }: Props) => {
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contenido.trim()) {
      setError("El comentario no puede estar vacío.");
      return;
    }

    setError("");

    if (onSubmit) {
      onSubmit(contenido);
    }

    console.log(contenido);

    setContenido("");
  };

  return (
    <section className="comment-form">

      <h3 className="comment-form__title">
        AGREGAR COMENTARIO
      </h3>

      <form onSubmit={handleSubmit}>

        <textarea
          className="comment-form__textarea"
          placeholder="Escribí tu comentario..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />

        {error && (
          <p className="comment-form__error">
            {error}
          </p>
        )}

        <button
          className="comment-form__button"
          type="submit"
        >
          <Send size={16} />
          ENVIAR COMENTARIO
        </button>

      </form>

    </section>
  );
};

export default CommentForm;