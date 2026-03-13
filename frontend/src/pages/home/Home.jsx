import HomeCard from './components/HomeCard';
import styles from './Home.module.css'
import { content } from './MockCards';
import { Link } from 'react-router';
const Home = () => {
  return (
    <div className={styles.container}>
      <article className={styles.top}>
        <section className={styles.left}>
          <h1>Certificados masivos en <span>segundos</span>, no horas</h1>
          <p>Sube tu archivo CSV, personaliza el diseño y
            exporta cientos de certificados en PDF de
            forma instantánea. Ahorra tiempo y elimina
            errores manuales hoy mismo.</p>
          <div className={styles.demoSection}>
            <Link to='/create' className={styles.begin}>
              Empezar ahora - Es gratis
            </Link>
            <a href='#como-funciona' className={styles.demo}>
              Ver demo
            </a>
          </div>
        </section>
        <div className={styles.right}>
          <Link
            to='/create'
            className={styles.outlined}
            aria-label='Ir al editor para subir el CSV'
          >
            <img src="upload.svg" alt="upload icon" />
            <p>
              Arrastra tu CSV para ver la magia
            </p>
          </Link>
        </div>
      </article>

      <article id='como-funciona' className={styles.process}>
        <h1>¿Cómo funciona?</h1>
        <p>Tres simples pasos para automatizar tu entrega de
          certificados sin complicaciones técnicas.
        </p>
        <div className={styles.cardSection}>
          {
            content.map(
              e => <HomeCard
                key={e.title}
                title={e.title}
                content={e.content}
                imageUrl={e.icon}
              />
            )
          }
        </div>
      </article>

      <article className={styles.bot}>
        <h1>¿Listo para automatizar tus certificados?</h1>
        <p>Únete a cientos de usuarios y empieza a
          generarlos hoy mismo. No se requiere tarjeta de crédito.
        </p>
        <Link to='/create' className={styles.lastBtn}>Empezar ahora gratis</Link>
      </article>
    </div>
  )
}

export default Home;