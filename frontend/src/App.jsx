import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Plantilla from './layout/Plantilla';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateProyect from './pages/CreateProyect';
import Perfil from './pages/Perfil';
import CodeProject from './pages/CodeProject';
import Suscriptions from './pages/Suscriptions';
import Search from './pages/Search';
import ProfileEdit from './pages/ProfileEdit';
import Foro from './pages/Foro';
import AdminPanel from './pages/AdminPanel';
import AdminProjects from './pages/AdminProjects';
import AdminUsers from './pages/AdminUsers';
import AdminMessagesUsers from './pages/AdminMessagesUsers';

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
            <Route path='/suscripciones' element={<Suscriptions />} />
            <Route path='/perfil' element={<Perfil />} />
            <Route path='/Search' element={<Search />} />
            <Route path='/editar-perfil' element={<ProfileEdit />} />
            <Route path='/foro' element={<Foro />} />
            <Route path='/Admin-panel' element={<AdminPanel />} />
            <Route path='/Admin-projects' element={<AdminProjects />} />
            <Route path='/Admin-users' element={<AdminUsers />} />
            <Route path='/Admin-messages' element={<AdminMessagesUsers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App