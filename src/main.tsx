import ReactDOM from 'react-dom/client'
import 'index.css'
import { App } from 'App'
import { Provider } from 'react-redux'
import { store } from 'app/store'
import { fetchUsers } from 'features/users/usersSlice'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { unwrapResult } from '@reduxjs/toolkit'
import { fetchPosts } from 'features/posts/postsSlice'

store
  .dispatch(fetchUsers())
  .then(unwrapResult)
  .catch((err) => {
    console.error('fetchUsers', err)
  })

store
  .dispatch(fetchPosts())
  .then(unwrapResult)
  .catch((err) => {
    console.error('fetchPosts', err)
  })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </BrowserRouter>
  </Provider>
)
