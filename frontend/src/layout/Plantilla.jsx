import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header';
import Footer from '../components/Footer';

const Plantilla = () => {
  const location = useLocation();
  
  return (
    <>
      <Header/>
      <main className='w-full min-h-screen'>
        <Outlet />
      </main>
      <Footer/>
    </>
  )
}

export default Plantilla