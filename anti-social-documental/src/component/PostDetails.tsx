import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FeedPost from "../component/FeedPost";
import ListComments from "../component/ListComments";
import CommentForm from "../component/CommentForm";
import type { Post, Comment } from "../types";
// @ts-ignore: allow importing CSS without type declarations
import "../styles/postDetails.css";

const PostDetails = () => {
  const { idPost } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Después reemplazás esto por tus services:
      // const postData = await getPostById(idPost!);
      // const commentsData = await getCommentsByPost(idPost!);

      console.log("Cargar post y comentarios del post:", idPost);

      setPost(null);
      setComments([]);
    } catch (error) {
      setError("No se pudo cargar la publicación.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idPost) {
      cargarDatos();
    }
  }, [idPost]);

  const handleCreateComment = async (contenido: string) => {
    try {
      // Después reemplazás esto por tu service:
      // await createComment({
      //   idPost: idPost!,
      //   idUser: usuarioLogueado.idUser,
      //   contenido,
      // });

      console.log("Crear comentario:", contenido);

      await cargarDatos();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <main className="post-details">
        <p className="post-details__message">Cargando publicación...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="post-details">
        <p className="post-details__error">{error}</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="post-details">
        <p className="post-details__message">
          No se encontró la publicación.
        </p>
      </main>
    );
  }

  return (
    <main className="post-details">
      <section className="post-details__container">
        <FeedPost dataPost={post} />

        <ListComments comments={comments} />

        <CommentForm onSubmit={handleCreateComment} />
      </section>
    </main>
  );
};

export default PostDetails;