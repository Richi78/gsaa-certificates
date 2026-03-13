import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>

      <section className={styles.content}>
        <small>© 2026 CertiAuto. All rights reserved.</small>
        <a
          className={styles.githubLink}
          href='https://github.com/Richi78/gsaa-certificates'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Abrir repositorio en GitHub'
          title='Repositorio en GitHub'
        >
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path
              fill='currentColor'
              d='M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.21.68-.48 0-.24-.01-1.03-.01-1.87-2.78.6-3.37-1.18-3.37-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.1-4.56-4.91 0-1.08.39-1.96 1.03-2.65-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.01A9.58 9.58 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.28 2.75-1.01 2.75-1.01.55 1.37.2 2.39.1 2.64.64.69 1.03 1.57 1.03 2.65 0 3.82-2.34 4.66-4.57 4.9.36.31.68.92.68 1.86 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z'
            />
          </svg>
        </a>
      </section>
    </footer>
  )
}

export default Footer;