import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

/**
 * Componente de ruta protegida para administradores
 * Verifica que el usuario tenga rol "admin" antes de renderizar las rutas hijo
 */
const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/users/UserController.php?action=session`,
          { withCredentials: true }
        );
        
        const userData = response.data;
        
        // Verificar si el usuario está autenticado y es admin
        if (userData && userData.rol === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          console.warn('Acceso restringido: No tienes permisos de administrador');
        }
      } catch (error) {
        console.error('Error al verificar la sesión de administrador:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [backendUrl]);

  // Mostrar un indicador de carga mientras se verifica la sesión
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verificando credenciales...</p>
      </div>
    );
  }

  // Redirigir al login si no es admin
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Si es admin, renderizar las rutas hijo (Outlet)
  return <Outlet />;
};

export default AdminRoute;
