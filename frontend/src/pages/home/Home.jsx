import HomeCard from './components/HomeCard';
import styles from './Home.module.css'
import { content } from './MockCards';
const Home = () => {
  return (
    <div className={styles.container}>
      <article className={styles.top}>
        <section className={styles.left}>
          <h1>Certificados masivos en <span>segundos</span>, no horas</h1>
          <p>Sube tu archivo CSV, personaliza el diseño y
            exporta cientos de certificados en PDF de
            forma instantánea. Ahorra tiemp y elimina
            errores manuales hoy mismo.</p>
          <div className={styles.demoSection}>
            <button className={styles.begin}>
              Empezar ahora - Es gratis
            </button>
            <button className={styles.demo}>
              Ver demo
            </button>
          </div>
        </section>
        <div className={styles.right}>
          <div className={styles.outlined}>
            <img src="upload.svg" alt="upload icon" />
            <p>
              Arrastra tu CSV para ver la magia
            </p>
          </div>
        </div>
      </article>

      <article className={styles.process}>
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
        {/* <div> */}
          <button className={styles.lastBtn}>Empezar ahora gratis</button>
        {/* </div> */}
      </article>
    </div>
  )
}

export default Home;