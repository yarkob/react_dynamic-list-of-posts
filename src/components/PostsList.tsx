import React, { Dispatch, SetStateAction } from 'react';
import { Post } from '../types/Post';
import cs from 'classnames';

interface Props {
  posts: Post[];
  setSelectedPost: Dispatch<SetStateAction<Post | null>>;
  selectedPost: Post | null;
}

export const PostsList: React.FC<Props> = ({
  posts,
  setSelectedPost,
  selectedPost,
}) => {
  const postClickHandler = (post: Post) => () => {
    setSelectedPost(selectedPost?.id === post.id ? null : post);
  };

  return (
    <div data-cy="PostsList">
      <p className="title">Posts:</p>

      <table className="table is-fullwidth is-striped is-hoverable is-narrow">
        <thead>
          <tr className="has-background-link-light">
            <th>#</th>
            <th>Title</th>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {posts.map(post => (
            <tr key={post.id} data-cy="Post">
              <td data-cy="PostId">{post.id}</td>

              <td data-cy="PostTitle">{post.title}</td>

              <td className="has-text-right is-vcentered">
                <button
                  type="button"
                  data-cy="PostButton"
                  className={cs('button is-link', {
                    'is-light': selectedPost?.id !== post.id,
                  })}
                  onClick={postClickHandler(post)}
                >
                  {selectedPost?.id === post.id ? 'Close' : 'Open'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
