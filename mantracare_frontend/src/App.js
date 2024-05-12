import './App.css';
import { io } from 'socket.io-client';
import Room from './Room';
import {FaPaperPlane} from 'react-icons/fa';
import { useEffect, useState } from 'react';

const socket = io('http://localhost:3500');

function App() {
  const roomId = "1234";
  // const [message, setMessage] = useState('');
  // const [messageList, setMessageList] = useState([]);

  // //make sure you get the username properly
  // const username = 'abebe';

  // const sendMessage = async () => {
  //   if(message !== '') {
  //     const messageData = {
  //       username,
  //       message,
  //       time: 
  //       new Date(Date.now()).getHours() +
  //       ":" +
  //       new Date(Date.now()).getMinutes(),
  //   };

  //   await socket.emit('send-message', messageData);
  //   setMessageList((list) => [...list, messageData]);
  //   setMessage('');
  // }
  // }

  // useEffect(()=>{
  //   //you add the real room over here
  // socket.emit('join-chat-room', roomId);
  // },[])

  // useEffect(() => {
  //   socket.on('receive-message', (receivedData) => {
  //     setMessageList((list) => [...list, receivedData]);
  //   });
  // }, [socket]);
  
 return(
  <Room roomId={roomId} socket={socket}/>
  // <div id='text-chat-container'>
  //   <div id='text-chat-header'></div>
  //   <div id='text-chat-body'>
  //     <ul>
  //       {messageList.map((message) => {
  //         return(
  //           <div 
  //             className='message-container' 
  //             id={username === message.username ? 'sent-message' : 'received-message'}
  //           >
  //             <div>{message.username}</div>
  //             <div><p>{message.message}</p></div>
  //             <div>{message.time}</div>
  //           </div>
  //         )
  //       })}
  //     </ul>
  //   </div>
  //   <div id='text-chat-footer'>
  //     <input 
  //       type='text' 
  //       value={message}
  //       placeholder='Write a message...' 
  //       onChange={(e) => {
  //         setMessage(e.target.value);
  //       }}
  //       onKeyDown={(e) => {
  //         if (e.key === 'Enter') {
  //           sendMessage();
  //         }
  //       }}
  //     />
  //     <button onClick={sendMessage}><FaPaperPlane /></button>
  //   </div>
  // </div>
 )
}
export default App;