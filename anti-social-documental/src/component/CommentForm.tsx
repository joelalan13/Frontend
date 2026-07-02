import { useState } from "react";
import { Send } from "lucide-react";
import commentServices from "../services/commentServices";
import type { CreateCommentPayload } from "../types";
// @ts-ignore: allow importing CSS without type declarations
import "../styles/commentForm.css";

type Props = {
  idPost: string;
  onCommentAdded?: () => void;
};

const CommentForm = ({ idPost, onCommentAdded }: Props) => {
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contenido.trim()) {
      setError("El comentario no puede estar vacío.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

      const payload: CreateCommentPayload = {
        idUser: usuario._id,
        contenido,
      };

      await commentServices.postCommentario(payload, idPost);

      setContenido("");
      alert("¡Comentario agregado con éxito!");

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error("Error al agregar comentario:", err);
      setError("Error al agregar el comentario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="comment-form">
      <h3 className="comment-form__title">AGREGAR COMENTARIO</h3>

      <form onSubmit={handleSubmit}>
        <textarea
          className="comment-form__textarea"
          placeholder="Escribí tu comentario..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          disabled={loading}
        />

        {error && <p className="comment-form__error">{error}</p>}

        <button
          className="comment-form__button"
          type="submit"
          disabled={loading}
        >
          <Send size={16} />
          {loading ? "ENVIANDO..." : "ENVIAR COMENTARIO"}
        </button>
      </form>
    </section>
  );
};

export default CommentForm;
