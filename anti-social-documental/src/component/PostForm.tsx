import { useState } from "react";
import { Image, Send, X } from "lucide-react";
// @ts-ignore: allow importing CSS without type declarations
import "../styles/postForm.css";

type Tag = {
  idTag: number;
  nombre: string;
};

const tagsMock: Tag[] = [
 //ACA IRIA EL GET DE TODOS LOS TAGS QUE EXISTEN
];

const PostForm = () => {
  const [descripcion, setDescripcion] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [error, setError] = useState("");

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

  const handleSelectTag = (idTag: number) => {
    if (selectedTags.includes(idTag)) {
      setSelectedTags(selectedTags.filter((id) => id !== idTag));
    } else {
      setSelectedTags([...selectedTags, idTag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    setError("");

    const nuevoPost = {
      descripcion,
      imageUrls: imageUrls.filter((url) => url.trim() !== ""),
      tags: selectedTags,
    };

    console.log(nuevoPost);
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
                  />
                </div>

                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    className="post-form__remove-url"
                    onClick={() => handleRemoveUrl(index)}
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
              >
                + Agregar otra URL
              </button>
            )}
          </div>

          {error && <p className="post-form__error">{error}</p>}

          <button className="post-form__submit" type="submit">
            PUBLICAR
            <Send size={17} />
          </button>
        </section>

        <aside className="post-form__tags-card">
          <h3>ETIQUETAS</h3>

          <div className="post-form__tags">
            {tagsMock.map((tag) => (
              <button
                key={tag.idTag}
                type="button"
                className={`post-form__tag ${
                  selectedTags.includes(tag.idTag)
                    ? "post-form__tag--active"
                    : ""
                }`}
                onClick={() => handleSelectTag(tag.idTag)}
              >
                #{tag.nombre}
              </button>
            ))}
          </div>
        </aside>
      </form>
    </main>
  );
};

export default PostForm;