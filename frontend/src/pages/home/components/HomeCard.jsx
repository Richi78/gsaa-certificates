import styles from './HomeCard.module.css'

const HomeCard = ({ title, content, imageUrl }) => {
  return (
    <article className={styles.container}>
      <div
        className={styles.img}
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <h2>{title}</h2>
      <p>{content}</p>
    </article>
  )
}

export default HomeCard