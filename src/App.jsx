import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css'; // Import external CSS

function App() {
  const [msg, setMsg] = useState('');
  const [msgs, setMsgs] = useState([]);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:3002', {
      withCredentials: true,
    });

    socket.current.on('new message', (incomingMsg) => {
      setMsgs((prevMsgs) => [...prevMsgs, incomingMsg]);
    });

    return () => {
      socket.current.off('new message');
      socket.current.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (msg.trim() === '') return;

    socket.current.emit('new message', msg);
    setMsg('');
  };

  return (
    <div className="container">
      <h1 className="title">💬 Realtime Chat App</h1>

      <div className="chatBox">
        <h3 className="subHeading">Messages</h3>
        <ul className="messageList">
          {msgs.map((curr, i) => (
            <li key={i} className="message">
              {curr}
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type your message..."
            className="input"
          />
          <button type="submit" className="button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
