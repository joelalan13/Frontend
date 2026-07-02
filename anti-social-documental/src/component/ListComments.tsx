    import Comment from "./Comment";
    import type { Comment as IComment } from "../types/index";
    // @ts-ignore: allow importing CSS without type declarations
    import "../styles/listComments.css";

    type Props = {
    comments: IComment[];
    };

    const ListComments = ({ comments }: Props) => {
    return (
        <section className="list-comments">
        <header className="list-comments__header">
            <h3>COMENTARIOS</h3>

            <span>{comments.length} visibles</span>
        </header>

        <div className="list-comments__content">
            {comments.length > 0 ? (
            comments.map((comment) => (
                <Comment key={comment.idComment} comment={comment} />
            ))
            ) : (
            <p className="list-comments__empty">
                Todavía no hay comentarios.
            </p>
            )}
        </div>
        </section>
    );
    };

    export default ListComments;