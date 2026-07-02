import { useState, useEffect } from "react";
import { Image, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import postServices from "../services/postServices";
import postImageServices from "../services/postImageServices";
import tagsServices from "../services/tagsServices";
import type { Post } from "../types";

// @ts-ignore: CSS module declaration not present in this project setup
import "../styles/postForm.css";

const PostForm = () => {
  const [descripcion, setDescripcion] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTagsFromPosts = async () => {
      setTagsLoading(true);
      try {
        const posts = await postServices.getPosts();
        
        const uniqueTags = new Set<string>();
        const seenNormalized = new Set<string>();
        
        posts.forEach((post: Post) => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag: any) => {
              const tagName = typeof tag === 'string' ? tag : tag.nombre;
              if (tagName) {
                const tagNormalized = tagName.toUpperCase();
                if (!seenNormalized.has(tagNormalized)) {
                  uniqueTags.add(tagName);
                  seenNormalized.add(tagNormalized);
                }
              }
            });
          }
        });

        setTags(Array.from(uniqueTags).sort());
      } catch (err) {
        console.error("Error al cargar tags:", err);
        setTags([]);
      } finally {
        setTagsLoading(false);
      }
    };

    fetchTagsFromPosts();
  }, []);

  const handleAddUrl = () => {
    if (imageUrls.length >= 10) return;
    setImageUrls([...imageUrls, ""]);
  };

  const handleRemoveUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, value: string) => {
    const nuevasUrls = [...imageUrls];
    nuevasUrls[index] = value;
    setImageUrls(nuevasUrls);
  };

  const handleSelectTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      
      const nuevoPost = await postServices.postPost({
        idUser: usuario._id,
        descripcion,
      });
     
      if (!nuevoPost?.idPost && !nuevoPost?._id) {
        throw new Error('No se encontro el id');
      }

      const postId: string = (nuevoPost.idPost ?? nuevoPost._id) as string;

      const urlsValidas = imageUrls.filter((url) => url.trim() !== "");
      if (urlsValidas.length > 0) {
        try {
          await postImageServices.postImage(
            { urlImages: urlsValidas },postId);
          console.log("Imágenes agregadas:", urlsValidas);
        } catch (imgErr) {
          console.error("Error al agregar imágenes:", imgErr);
        }
      }

      if (selectedTags.length > 0) {
        for (const tagName of selectedTags) {
          try {
            const tagMayuscula = tagName.toUpperCase();
            await tagsServices.addTagToPost(postId, tagMayuscula);
            console.log("Tag agregado:", tagMayuscula);
          } catch (tagErr) {
            console.error(`Error al agregar tag ${tagName}:`, tagErr);
          }
        }
      }

      console.log("Post creado:", nuevoPost);
      alert("¡Publicación creada con éxito!");
      navigate("/");
    } catch (err: any) {
      console.error("Error al crear post:", err);
      setError("Error al crear la publicación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="post-form-page">
      <section className="post-form-page__header">
        <h1 className="post-form-page__title">
          Nueva <span>publicación.</span>
        </h1>
      </section>

      <form className="post-form" onSubmit={handleSubmit}>
        <section className="post-form__main">
          <label className="post-form__label">
            DESCRIPCIÓN *
            <textarea
              className="post-form__textarea"
              placeholder="¿Qué querés compartir con la comunidad?"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={loading}
            />
          </label>

          <div className="post-form__images">
            <span className="post-form__label">
              URLS DE IMÁGENES (OPCIONAL · MÁX. 10)
            </span>

            {imageUrls.map((url, index) => (
              <div className="post-form__url-row" key={index}>
                <div className="post-form__url-input">
                  <Image size={16} />
                  <input
                    type="text"
                    placeholder="https://ejemplo.com/foto.jpg"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    disabled={loading}
                  />
                </div>

                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    className="post-form__remove-url"
                    onClick={() => handleRemoveUrl(index)}
                    disabled={loading}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}

            {imageUrls.length < 10 && (
              <button
                type="button"
                className="post-form__add-url"
                onClick={handleAddUrl}
                disabled={loading}
              >
                + Agregar otra URL
              </button>
            )}
          </div>

          {error && <p className="post-form__error">{error}</p>}

          <button 
            className="post-form__submit" 
            type="submit"
            disabled={loading}
          >
            {loading ? "PUBLICANDO..." : "PUBLICAR"}
            <Send size={17} />
          </button>
        </section>

        <aside className="post-form__tags-card">
          <h3>ETIQUETAS</h3>

          <div className="post-form__tags">
            {!tagsLoading && tags.length > 0 ? (
              tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`post-form__tag ${
                    selectedTags.includes(tag)
                      ? "post-form__tag--active"
                      : ""
                  }`}
                  onClick={() => handleSelectTag(tag)}
                  disabled={loading}
                >
                  #{tag}
                </button>
              ))
            ) : tagsLoading ? (
              <p>Cargando etiquetas...</p>
            ) : (
              <p>No hay etiquetas disponibles aún</p>
            )}
          </div>
        </aside>
      </form>
    </main>
  );
};

export default PostForm;