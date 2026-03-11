import styles from './Header.module.css'
import { Link } from 'react-router';

const Header = () => {
  return (
    <nav className={styles.nav}>
      <h1>CertiAuto</h1>
      <Link to="/">Empezar ahora</Link>
    </nav>
  )
}

export default Header;