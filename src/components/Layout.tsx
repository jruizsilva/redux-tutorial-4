import { Outlet } from 'react-router-dom'
import { Header } from './Header'

interface Props {}

export default function Layout(props: Props) {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}
