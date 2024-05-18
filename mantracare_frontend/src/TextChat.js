import { FaPaperPlane } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TextChat = ({ socket }) => {
  const { roomId } = useParams();
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  // Make sure you get the username properly
  const username = 'abebe';

  const sendMessage = async () => {
    if (message !== '') {
      const messageData = {
        username,
        message,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };
  
      setMessageList((prevMessageList) => [...prevMessageList, messageData]); // Add the user's message to the list
      await socket.emit('send-message', messageData);
      setMessage('');
    }
  };

  useEffect(() => {
    // Join the chat room when the component mounts
    socket.emit('join-chat-room', roomId);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('receive-message');
    };
  }, [socket, roomId]);

  useEffect(() => {
    socket.on('receive-message', (receivedData) => {
      setMessageList((prevMessageList) => [...prevMessageList, receivedData]);
    });
  }, [socket]);

  return (
    <div id="text-chat-container">
      <div id="text-chat-header"></div>
      <div id="text-chat-body">
        <ul>
          {messageList.map((message, index) => (
            <div
              className="message-container"
              id={username === message.username ? 'sent-message' : 'received-message'}
              key={index}
            >
              <div>{message.username}</div>
              <div>
                <p>{message.message}</p>
              </div>
              <div>{message.time}</div>
            </div>
          ))}
        </ul>
      </div>
      <div id="text-chat-footer">
        <input
          type="text"
          value={message}
          placeholder="Write a message..."
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default TextChat;