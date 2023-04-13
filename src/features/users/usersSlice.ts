import {
  type PayloadAction,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit'
import { type RootState } from 'app/store'
import axios from 'axios'
import { fetchUsersAdapter } from './fetchUsersAdapter'
import { type Status } from 'features/posts/postsSlice'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

export interface UserData {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
}
export interface User extends Omit<UserData, 'id'> {
  id: string
}

interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Geo
}

interface Geo {
  lat: string
  lng: string
}

interface Company {
  name: string
  catchPhrase: string
  bs: string
}

interface InitialStateUsersSlice {
  users: User[]
  status: Status
  error: string | null
}

const INITIAL_STATE: InitialStateUsersSlice = {
  users: [],
  status: 'idle',
  error: null
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get<UserData[]>(USERS_URL)
  return fetchUsersAdapter(response.data)
})

const usersSlice = createSlice({
  name: 'users',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message ?? 'Unknown error'
    })
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        state.error = null
        state.users = action.payload
        state.status = 'succeeded'
      }
    )
  }
})

export const selectAllUsers = (store: RootState) => store.users.users

export default usersSlice
