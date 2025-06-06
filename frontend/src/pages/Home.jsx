import { useEffect, useState } from 'react'
import axios from 'axios'

const Home = () => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [user, setUser] = useState(null)
 
  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/UserController.php?action=session`,
          { withCredentials: true }
        );
        const userData = response.data;
        setUser(userData);
        console.log("Datos de usuario recibidos:", response);
      } catch (error) {
        console.log("Error al obtener la sesión:", error)
      }
    }

    getSession()
  }, [])

  const logout = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/users/UserController.php?action=logout`,
        { withCredentials: true }
      );
      const userData = response.data;
      setUser(userData);
      console.log("Datos de usuario recibidos:", response);
    } catch (error) {
      console.log("Error al obtener la sesión:", error)
    }
  }

  return (
    <>
      <div>
        <h1>Home</h1>
      </div>
      {user ? (
        <>
          <div>
            <p>Usuario: {user.user}</p>
            <p>Email: {user.email}</p>
            <p>ID: {user.id}</p>
          </div>
          <button onClick={() => {logout()}}>Cerrar Sesión</button>
        </>
      ) : (
        <p>Cargando usuario...</p>
      )}
    </>
  )
}

export default Home