import styles from './Header.module.css'
import { Link } from 'react-router';

const Header = () => {
  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      <Link to="/" className={styles.brand} aria-label="Ir al inicio de CertiAuto">
        <span className={styles.brandDot}></span>
        <h1>CertiAuto</h1>
      </Link>
      <Link to="/create" className={styles.cta}>Empezar ahora</Link>
    </nav>
  )
}

export default Header;