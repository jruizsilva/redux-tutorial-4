import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useNavigate, useParams } from 'react-router-dom'
import {
  selectPostById,
  type Status,
  updatePost,
  deletePost
} from './postsSlice'
import { type User, selectAllUsers } from 'features/users/usersSlice'
import { type ChangeEvent, useState } from 'react'
import { unwrapResult } from '@reduxjs/toolkit'

const INITIAL_FORM_VALUES = {
  title: '',
  body: '',
  authorId: ''
}

export function EditPostForm() {
  const { postId } = useParams()
  const post = useAppSelector((state) =>
    selectPostById(state, postId as string)
  )

  const users = useAppSelector(selectAllUsers)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [formValues, setFormValues] = useState(
    post === undefined ? INITIAL_FORM_VALUES : post
  )
  const { title, body, authorId } = formValues
  const [editRequestData, setEditRequestData] = useState<Status>('idle')
  const [deleteRequestData, setDeleteRequestData] = useState<Status>('idle')

  if (post === undefined) {
    return (
      <section>
        <h3>Post not found!</h3>
      </section>
    )
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }
  const canSave =
    [title, body, authorId].every(Boolean) && editRequestData === 'idle'

  const canDelete = deleteRequestData === 'idle'

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (canSave) {
      setEditRequestData('loading')
      dispatch(
        updatePost({
          body,
          title,
          userId: Number(authorId),
          id: Number(post.id),
          reactions: post.reactions,
          date: post.date
        })
      )
        .then(unwrapResult)
        .then(() => {
          navigate(`/post/${post.id}`)
        })
        .catch((err) => {
          console.error('updatePost', err)
        })
        .finally(() => {
          setEditRequestData('idle')
        })
    }
  }

  const handleDelete = () => {
    setDeleteRequestData('loading')
    dispatch(deletePost(post.id))
      .then(unwrapResult)
      .then(() => {
        navigate('/')
        setDeleteRequestData('succeeded')
      })
      .catch((err) => {
        console.error('deletePost', err)
        setDeleteRequestData('failed')
      })
  }

  const authorOptions = users.map(({ id, name }: User) => {
    return (
      <option value={id} key={id}>
        {name}
      </option>
    )
  })

  return (
    <>
      <section>
        <h2>Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor='postTitle'>Post Title: </label>
          <input
            type='text'
            id='postTitle'
            name='title'
            value={title}
            onChange={handleChange}
          />
          <label htmlFor='authorId'>Author: </label>
          <select
            name='authorId'
            id='authorId'
            value={authorId}
            onChange={handleChange}
          >
            <option value=''>Select an author</option>
            {authorOptions}
          </select>
          <label htmlFor='postContent'>Post Content: </label>
          <input
            type='text'
            id='postContent'
            name='body'
            value={body}
            onChange={handleChange}
          />

          <button type='submit' disabled={!canSave}>
            Edit Post
          </button>
          <button
            type='button'
            className='deleteButton'
            onClick={handleDelete}
            disabled={!canDelete}
          >
            Delete Post
          </button>
        </form>
      </section>
    </>
  )
}
