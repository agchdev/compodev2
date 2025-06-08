import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Plantilla from './layout/Plantilla';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateProyect from './pages/CreateProyect';
import Perfil from './pages/Perfil';
import CodeProject from './pages/CodeProject';
import Search from './pages/Search';
import ProfileEdit from './pages/ProfileEdit';
import Foro from './pages/Foro';
import AdminPanel from './pages/AdminPanel';
import AdminProjects from './pages/AdminProjects';
import AdminUsers from './pages/AdminUsers';
import UserContentPanel from './pages/UserContentPanel';
import UserProfile from './pages/UserProfile';
import CookieConsent from './components/CookieConsent';
import SubscriptionSimple from './pages/SubscriptionSimple';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Plantilla />}>
            <Route index element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/crearProyecto' element={<CreateProyect />} />
            <Route path='/code-project/:id' element={<CodeProject />} />
            <Route path='/suscripciones' element={<SubscriptionSimple />} />
            <Route path='/perfil' element={<Perfil />} />
            <Route path='/profile/:userId' element={<UserProfile />} />
            <Route path='/Search' element={<Search />} />
            <Route path='/editar-perfil' element={<ProfileEdit />} />
            <Route path='/foro' element={<Foro />} />
            <Route path='/Admin-panel' element={<AdminPanel />} />
            <Route path='/Admin-projects' element={<AdminProjects />} />
            <Route path='/Admin-users' element={<AdminUsers />} />
            <Route path='/Admin-messages' element={<UserContentPanel />} />
          </Route>
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </>
  )
}

export default App