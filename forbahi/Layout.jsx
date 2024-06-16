import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Routers from '../routes/Routers'
import { io } from 'socket.io-client';
import { GlobalStateProvider } from '../provider/GlobalStateProvider';

const socket = io('http://localhost:3500');

const Layout = () => {
  return (
    <>
    <GlobalStateProvider>
     <Header />
      <main>
      <Routers socket={socket} />
      </main>
      <Footer />
      </GlobalStateProvider>
      
    </>
    
  );
  
};

export default Layout;