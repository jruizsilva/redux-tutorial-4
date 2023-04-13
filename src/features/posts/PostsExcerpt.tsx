import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'
import { type Post } from './postsSlice'

interface Props {
  post: Post
}

export function PostsExcerpt({ post }: Props) {
  return (
    <article>
      <h3>{post.title}</h3>
      <p className='excerpt'>{post.body.substring(0, 75)}</p>
      <p className='postCredit'>
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor authorId={post.authorId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  )
}
