import styles from './Header.module.css'
import { Link } from 'react-router';

const Header = () => {
  return (
    <nav className={styles.nav}>
      <Link to="/"><h1>CertiAuto</h1></Link>
      <Link to="/create">Empezar ahora</Link>
    </nav>
  )
}

export default Header;