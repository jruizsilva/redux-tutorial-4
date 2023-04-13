import { Link } from 'react-router-dom'

interface Props {}

export function Header(props: Props) {
  return (
    <header>
      <h1>Redux blog</h1>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='post'>Post</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
