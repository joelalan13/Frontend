// @ts-ignore: allow importing CSS without type declarations
import "../styles/comment.css";
import type { Comment } from "../types";

type Props = {
  comment: Comment;
};

const Comment = ({ comment }: Props) => {


  return (
    <article className="comment">

      <div className="comment__avatar">
        {/*Aca iria las iniciales del nombre y apellido del usuario */}
        <p>EQ</p>
      </div>

      <div className="comment__body">

        <div className="comment__header">

          <span className="comment__user">
            {/*aca el nombre del usuario*/}
            <p>Esteban Quito</p>
          </span>

          <span className="comment__time">
            {/*Cuanto tiempo tiene el comentario de creado*/}
            <p>3 horas</p>
          </span>

        </div>

        <p className="comment__text">
          {/*El contenido del comentario*/}
          <p> ASHIDOASHDAOIDHASOIDASHD </p>
        </p>

      </div>

    </article>
  );
};

export default Comment;