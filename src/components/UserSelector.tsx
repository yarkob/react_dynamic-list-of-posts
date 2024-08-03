import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { client } from '../utils/fetchClient';
import { User } from '../types/User';
import { Post } from '../types/Post';
import { Error } from '../App';
import cs from 'classnames';

interface Props {
  setPosts: Dispatch<SetStateAction<Post[]>>;
  setError: Dispatch<SetStateAction<Error | null>>;
  setIsUserLoading: Dispatch<SetStateAction<boolean>>;
  setSelectedUser: Dispatch<SetStateAction<User | null>>;
  setSelectedPost: Dispatch<SetStateAction<Post | null>>;
  selectedUser: User | null;
}

export const UserSelector: React.FC<Props> = ({
  setPosts,
  setError,
  setIsUserLoading,
  setSelectedUser,
  setSelectedPost,
  selectedUser,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isUsersShown, setIsUserShown] = useState(false);

  const handleUsersDropdown = (value: boolean) => () => {
    console.log('handle dropdown', value);
    setIsUserShown(value);
  };

  useEffect(() => {
    client.get('/users').then(unknownData => {
      const data = unknownData as User[];

      setUsers(data);
    });
  }, [isUsersShown]);

  const userClickHandler = (user: User) => () => {
    console.log('select user', user);
    setSelectedPost(null);
    setSelectedUser(user);
    setIsUserLoading(true);
    client
      .get(`/posts?userId=${user?.id}`)
      .then(unknownData => {
        const data = unknownData as Post[];

        setPosts(() => data);
        setIsUserLoading(false);
      })
      .catch(error => {
        setError(Error.PostLoading);

        return error;
      });

    setIsUserShown(false);
  };

  return (
    <div
      data-cy="UserSelector"
      className={cs('dropdown', {
        'is-active': isUsersShown,
      })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={handleUsersDropdown(true)}
          onBlur={handleUsersDropdown(false)}
        >
          <span>{selectedUser ? selectedUser?.name : 'Choose a user'}</span>

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>

        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {users.map(user => (
              <a
                key={user.id}
                href={`#user-${user.id}`}
                className={cs('dropdown-item', {
                  'is-active': user.id === selectedUser?.id,
                })}
                onMouseDown={userClickHandler(user)}
              >
                {user.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
