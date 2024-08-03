import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { client } from '../utils/fetchClient';
import { Comment } from '../types/Comment';
import { Loader } from './Loader';
import { Error } from '../App';

interface Props {
  selectedPost: Post;
  setError: Dispatch<SetStateAction<Error | null>>;
  error: Error | null;
}

export const PostDetails: React.FC<Props> = ({
  selectedPost,
  setError,
  error,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isFormShown, setIsFormShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError(null);

    setIsLoading(true);

    client
      .get<Comment[]>(`/comments?postId=${selectedPost.id}`)
      .then(data => {
        setComments(data);
      })
      .catch(() => {
        setError(Error.CommentLoading);
      })
      .finally(() => {
        setIsFormShown(false);
        setIsLoading(false);
      });
  }, [selectedPost, setError, setIsLoading]);

  const deleteHandler = (commentId: number) => () => {
    const filteredComments = comments.filter(
      comment => comment.id !== commentId,
    );

    client.delete(`/comments/${commentId}`).catch(dataError => {
      setError(Error.CommentLoading);

      return dataError;
    });

    console.log(comments);

    setComments(filteredComments);
  };

  const writeCommentHandler = () => {
    setIsFormShown(true);
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="block">
        <h2 data-cy="PostTitle">{`#${selectedPost?.id}: ${selectedPost?.title}`}</h2>

        <p data-cy="PostBody">{selectedPost?.body}</p>
      </div>

      <div className="block">
        {isLoading ? (
          <Loader />
        ) : Error.CommentLoading === error ? (
          <div className="notification is-danger" data-cy="CommentsError">
            Something went wrong
          </div>
        ) : (
          <>
            {comments.length === 0 ? (
              <p className="title is-4" data-cy="NoCommentsMessage">
                No comments yet
              </p>
            ) : (
              <p className="title is-4">Comments:</p>
            )}

            {comments.map(comment => (
              <article
                key={comment.id}
                className="message is-small"
                data-cy="Comment"
              >
                <div className="message-header">
                  <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                    {comment.name}
                  </a>
                  <button
                    data-cy="CommentDelete"
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                    onClick={deleteHandler(comment.id)}
                  >
                    delete button
                  </button>
                </div>

                <div className="message-body" data-cy="CommentBody">
                  {comment.body}
                </div>
              </article>
            ))}

            {!isFormShown && (
              <button
                data-cy="WriteCommentButton"
                type="button"
                className="button is-link"
                onClick={writeCommentHandler}
              >
                Write a comment
              </button>
            )}
          </>
        )}

        {isFormShown && (
          <NewCommentForm
            selectedPost={selectedPost}
            setComments={setComments}
            comments={comments}
          />
        )}
      </div>
    </div>
  );
};
