import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Routers from '../routes/Routers'
import { io } from 'socket.io-client';
import { GlobalStateProvider } from '../provider/GlobalStateProvider';
import Header2 from '../components/Header/Header2';

const socket = io('http://localhost:3500');


const Layout = () => {
  const userRole = localStorage.getItem('roles')
  return (
    <>
    <GlobalStateProvider>
    {userRole === 'Patient' ? <Header /> : (userRole === 'Therapist' ? <Header2 /> : null)}
      <main>
      <Routers socket={socket} />
      </main>
      <Footer />
      </GlobalStateProvider>
      
    </>
    
  );
  
};

export default Layout;