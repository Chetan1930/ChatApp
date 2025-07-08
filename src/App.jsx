import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [msg, setMsg] = useState('');
  const [msgs, setMsgs] = useState([]);
  const socket = useRef(null);

  useEffect(() => {
    // Connect to the server
    socket.current = io('http://localhost:3002', {
      withCredentials: true,
    });

    // Listen for incoming messages
    socket.current.on('new message', (incomingMsg) => {
      setMsgs((prevMsgs) => [...prevMsgs, incomingMsg]);
    });

    // Cleanup on unmount
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
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Socket.IO Chat</h1>

      <h3>Messages</h3>
      <ul>
        {msgs.map((curr, i) => (
          <li key={i}>{curr}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Enter your message"
          style={{ padding: '0.5rem', width: '250px' }}
        />
        <button type="submit" style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
