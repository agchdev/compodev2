import { Link } from "react-router-dom"


const Header = () => {
  return (
    <header>
        <Link to="/crearProyecto">Crear Proyecto</Link>
        <Link to="/suscripciones">Suscripciones</Link>
        <Link to="/perfil">Ver Perfil</Link>
        <Link to="/">Home</Link>
        <Link to="/Search">Buscador</Link>
    </header>
  )
}

export default Header
