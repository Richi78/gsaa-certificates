import styles from './App.module.css'
import { Routes, Route } from 'react-router'
import Home from './pages/home/Home'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import EditPage from './pages/editCanvas/EditPage'

function App() {

  return (
    <div className={styles.container}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<EditPage />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
