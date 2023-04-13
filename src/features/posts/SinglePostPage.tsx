import { useAppSelector } from 'app/hooks'
import { selectPostById, getPostsStatus } from './postsSlice'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { Link, useParams } from 'react-router-dom'

interface Props {}

export function SinglePostPage(props: Props) {
  const { postId } = useParams()
  const post = useAppSelector((state) =>
    selectPostById(state, postId as string)
  )
  const status = useAppSelector(getPostsStatus)

  if (status === 'loading') {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    )
  }

  if (post === undefined) {
    return (
      <div>
        <h3>Post not found</h3>
      </div>
    )
  }

  return (
    <>
      <article>
        <h2>{post?.title}</h2>
        <p>{post?.body}</p>
        <p className='postCredit'>
          <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
          <PostAuthor authorId={post?.authorId} />
          <TimeAgo timestamp={post.date} />
        </p>
        <ReactionButtons post={post} />
      </article>
    </>
  )
}
