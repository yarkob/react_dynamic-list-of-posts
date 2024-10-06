import React, { useState } from 'react';
import 'bulma/bulma.sass';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { UserSelector } from './components/UserSelector';
import { Post } from './types/Post';
import { Loader } from './components/Loader';
import { User } from './types/User';
import classNames from 'classnames';
import { PostDetails } from './components/PostDetails';

export enum Error {
  PostLoading = 'PostLoading',
  CommentLoading = 'CommentLoading',
}

export const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  setError={setError}
                  setPosts={setPosts}
                  setIsUserLoading={setIsUserLoading}
                  setSelectedUser={setSelectedUser}
                  setSelectedPost={setSelectedPost}
                  selectedUser={selectedUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {isUserLoading && !error && <Loader />}

                {Error.PostLoading === error && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {posts.length === 0 && selectedUser && !isUserLoading && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {posts.length > 0 && !isUserLoading && (
                  <PostsList
                    setSelectedPost={setSelectedPost}
                    posts={posts}
                    selectedPost={selectedPost}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': selectedPost,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPost && (
                <PostDetails
                  selectedPost={selectedPost}
                  setError={setError}
                  error={error}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
