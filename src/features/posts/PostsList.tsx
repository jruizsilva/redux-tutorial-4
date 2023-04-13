import { useAppSelector } from 'app/hooks'
import { getPostsError, getPostsStatus, selectAllPosts } from './postsSlice'
import { PostsExcerpt } from './PostsExcerpt'

const PostsList = () => {
  const posts = useAppSelector(selectAllPosts)
  const status = useAppSelector(getPostsStatus)
  const error = useAppSelector(getPostsError)

  let content
  if (status === 'loading') {
    content = <p>Loading...</p>
  } else if (status === 'succeeded') {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPosts.map((post) => {
      return <PostsExcerpt key={post.id} post={post} />
    })
  } else if (status === 'failed') {
    content = <p>{error}</p>
  }

  return <div>{content}</div>
}

export default PostsList
