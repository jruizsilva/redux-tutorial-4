import { type Post, type PostDataUpdate } from './postsSlice'

export function updatePostAdapter(post: PostDataUpdate): Post {
  const { body, date, reactions, id, title, userId } = post
  return {
    body,
    date,
    reactions,
    title,
    id: id.toString(),
    authorId: userId.toString()
  }
}
