import React, { useState, useEffect } from 'react'

const AdminPanel = () => {
  const [projectStats, setProjectStats] = useState(null)
  const [messageStats, setMessageStats] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost/CompoDev/backend';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Obtener estadísticas de proyectos
        const projectResponse = await fetch(`${backendUrl}/admin_panel/AdminController.php?action=projectStats`)
        const projectData = await projectResponse.json()

        // Obtener estadísticas de mensajes
        const messageResponse = await fetch(`${backendUrl}/admin_panel/AdminController.php?action=messageStats`)
        const messageData = await messageResponse.json()
        
        // Obtener estadísticas de usuarios
        const userResponse = await fetch(`${backendUrl}/admin_panel/AdminController.php?action=userStats`)
        const userData = await userResponse.json()
        
        setProjectStats(projectData)
        setMessageStats(messageData)
        setUserStats(userData)
        setLoading(false)
      } catch (err) {
        console.error('Error al cargar estadísticas:', err)
        setError('Error al cargar las estadísticas. Intenta de nuevo más tarde.')
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  if (loading) {
    return <div>Cargando estadísticas...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <h1>Panel de Administración</h1>
      
      <div>
        <h2>Estadísticas de Proyectos</h2>
        {projectStats && (
          <div>
            <p>Últimas 24 horas: {projectStats.last_24h}</p>
            <p>Última semana: {projectStats.last_week}</p>
            <p>Último mes: {projectStats.last_month}</p>
            <p>Último año: {projectStats.last_year}</p>
          </div>
        )}
      </div>
      
      <div>
        <h2>Estadísticas de Mensajes</h2>
        {messageStats && (
          <div>
            <p>Últimas 24 horas: {messageStats.last_24h}</p>
            <p>Última semana: {messageStats.last_week}</p>
            <p>Último mes: {messageStats.last_month}</p>
            <p>Último año: {messageStats.last_year}</p>
          </div>
        )}
      </div>
      
      <div>
        <h2>Estadísticas de Usuarios</h2>
        {userStats && (
          <div>
            <p>Últimas 24 horas: {userStats.last_24h}</p>
            <p>Última semana: {userStats.last_week}</p>
            <p>Último mes: {userStats.last_month}</p>
            <p>Último año: {userStats.last_year}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel