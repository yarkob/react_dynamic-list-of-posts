import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { client } from '../utils/fetchClient';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';
import cs from 'classnames';

interface Props {
  selectedPost: Post | null;
  setComments: Dispatch<SetStateAction<Comment[]>>;
  comments: Comment[];
}

export const NewCommentForm: React.FC<Props> = ({
  selectedPost,
  setComments,
  comments,
}) => {
  const [form, setForm] = useState<Comment>({
    id: Math.random(),
    postId: selectedPost?.id ? selectedPost.id : 1,
    name: '',
    email: '',
    body: '',
  });
  const [formError, setFormError] = useState({
    title: false,
    email: false,
    body: false,
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    if (!form.name.length) {
      setFormError(prevFormError => {
        return { ...prevFormError, title: true };
      });
    }

    if (!form.email.length) {
      setFormError(prevFormError => {
        return { ...prevFormError, email: true };
      });
    }

    if (!form.body.length) {
      setFormError(prevFormError => {
        return { ...prevFormError, body: true };
      });
    }

    if (!form.name.length || !form.email.length || !form.body.length) {
      return;
    }

    setForm({ ...form, body: '' });

    setFormError({
      title: false,
      email: false,
      body: false,
    });

    setSubmitLoading(true);

    client
      .post('/comments', { ...form })
      .then(() => {
        setComments([...comments, form]);
      })
      .catch(error => {
        if (error) {
          throw new Error(error);
        }
      })
      .finally(() => setSubmitLoading(false));
  };

  useEffect(() => {
    console.log(formError);
  }, [formError]);

  const titleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setFormError({ ...formError, title: false });

    setForm({ ...form, name: event.target.value });
  };

  const emailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setFormError({ ...formError, email: false });

    setForm({ ...form, email: event.target.value });
  };

  const bodyChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormError({ ...formError, body: false });

    setForm({ ...form, body: event.target.value });
  };

  const resetHandler = () => {
    setForm({
      ...form,
      name: '',
      email: '',
      body: '',
    });
    setFormError({
      title: false,
      email: false,
      body: false,
    });
  };

  return (
    <form data-cy="NewCommentForm" onSubmit={submitHandler}>
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={cs('input', {
              'is-danger': formError.title,
            })}
            value={form.name}
            onChange={titleChangeHandler}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {formError.title && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {formError.title && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={cs('input', {
              'is-danger': formError.email,
            })}
            value={form.email}
            onChange={emailChangeHandler}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {formError.email && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {formError.email && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={cs('textarea', {
              'is-danger': formError.body,
            })}
            value={form.body}
            onChange={bodyChangeHandler}
          />
        </div>

        {formError.body && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={cs('button is-link', {
              'is-loading': submitLoading,
            })}
          >
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            type="reset"
            className="button is-link is-light"
            onClick={resetHandler}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
