import {
  type PayloadAction,
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit'
import { type RootState } from 'app/store'
import axios from 'axios'
import { fetchPostsAdapter } from 'features/posts/fetchPostsAdapter'
import { addNewPostAdapter } from './addNewPostAdapter'
import { updatePostAdapter } from './updatePostAdapter'

const POST_URL = 'https://jsonplaceholder.typicode.com/posts'

export interface PostData {
  userId: number
  id: number
  title: string
  body: string
}
export interface Post extends Pick<PostData, 'title' | 'body'> {
  id: string
  date: string
  authorId?: string
  reactions: Reactions
}
export interface PostDataUpdate extends PostData {
  reactions: Reactions
  date: string
}
type IObjectKeys = Record<string, number>

interface Reactions extends IObjectKeys {
  thumbsUp: number
  wow: number
  heart: number
  rocket: number
  coffee: number
}

export interface PrepareAddPostProps
  extends Omit<Post, 'id' | 'date' | 'reactions'> {}

export interface PayloadAddReaction {
  postId: string
  reaction: keyof Reactions
}

export const INITIAL_REACTIONS = {
  thumbsUp: 0,
  wow: 0,
  heart: 0,
  rocket: 0,
  coffee: 0
}
export type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

interface InitialStatePostsSlice {
  posts: Post[]
  status: Status
  error: string | null
}

const INITIAL_STATE: InitialStatePostsSlice = {
  posts: [],
  status: 'idle',
  error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get<PostData[]>(POST_URL)
  return fetchPostsAdapter(response.data)
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (postToAdd: Omit<PostData, 'id'>) => {
    const response = await axios.post<PostData>(POST_URL, postToAdd)
    return addNewPostAdapter(response.data)
  }
)
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (postToUpdate: PostDataUpdate) => {
    const { id } = postToUpdate
    const response = await axios.put(`${POST_URL}/${id}`, postToUpdate)
    return updatePostAdapter(response.data)
  }
)

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: string) => {
    await axios.delete(`${POST_URL}/${postId}`)
    return { id: postId }
  }
)

export const postsSlice = createSlice({
  name: 'posts',
  initialState: INITIAL_STATE,
  reducers: {
    // addPost: {
    //   reducer(state, action: PayloadAction<Post>) {
    //     state.posts.push(action.payload)
    //   },
    //   prepare({ body, title, authorId }: PrepareAddPostProps) {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         date: new Date().toISOString(),
    //         title,
    //         body,
    //         authorId,
    //         reactions: INITIAL_REACTIONS
    //       }
    //     }
    //   }
    // },
    addReaction(state, action: PayloadAction<PayloadAddReaction>) {
      const { postId, reaction } = action.payload
      const postToUpdate = state.posts.find((post) => post.id === postId)
      if (postToUpdate !== undefined) {
        postToUpdate.reactions[reaction]++
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchPosts.pending, (state) => {
      state.status = 'loading'
    })

    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.error = action.error.message ?? 'Unknown error'
      state.status = 'failed'
    })
    builder.addCase(
      fetchPosts.fulfilled,
      (state, action: PayloadAction<Post[]>) => {
        state.status = 'succeeded'
        state.posts = action.payload
      }
    )
    builder.addCase(addNewPost.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(addNewPost.rejected, (state, action) => {
      state.error = action.error.message ?? 'Unknown error'
      state.status = 'failed'
    })
    builder.addCase(
      addNewPost.fulfilled,
      (state, action: PayloadAction<Post>) => {
        state.status = 'succeeded'
        state.posts.push(action.payload)
      }
    )
    builder.addCase(updatePost.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(updatePost.rejected, (state, action) => {
      state.error = action.error.message ?? 'Unknown error'
      state.status = 'failed'
    })
    builder.addCase(
      updatePost.fulfilled,
      (state, action: PayloadAction<Post>) => {
        const { id } = action.payload
        const posts = state.posts.filter((post) => post.id !== id)
        state.status = 'succeeded'
        state.posts = [...posts, action.payload]
      }
    )
    builder.addCase(deletePost.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(deletePost.rejected, (state, action) => {
      state.error = action.error.message ?? 'Unknown error'
      state.status = 'failed'
    })
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.posts = state.posts.filter((post) => post.id !== action.payload.id)
    })
  }
})

export const selectAllPosts = (state: RootState) => state.posts.posts
export const getPostsStatus = (state: RootState) => state.posts.status
export const getPostsError = (state: RootState) => state.posts.error

export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post) => post.id === postId)

export const { addReaction } = postsSlice.actions

export default postsSlice
