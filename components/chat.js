import React, { useState, useEffect } from 'react';
import { Client, Databases, Query } from 'appwrite';

const Chat = ({ eventId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Inițializare client Appwrite
  const client = new Client();
  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) // Setează endpoint-ul
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID); // Setează ID-ul proiectului
  const databases = new Databases(client);

  // Funcția pentru a prelua mesajele
  const fetchMessages = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DB_ID, // ID-ul bazei de date
        process.env.NEXT_PUBLIC_CHAT_COLLECTION_ID, // ID-ul colecției de chat
        [Query.equal('eventId', eventId)] // Filtrarea după eventId
      );
      setMessages(response.documents);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Funcția pentru a trimite mesajele
  const sendMessage = async (eventId, userId, message) => {
    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DB_ID, // ID-ul bazei de date
        process.env.NEXT_PUBLIC_CHAT_COLLECTION_ID, // ID-ul colecției de chat
        'unique()', // ID-ul documentului (poți folosi 'unique()' pentru un ID generat automat)
        { eventId, userId, message } // Datele mesajului
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    fetchMessages(); // Preia mesajele la montarea componentei
  }, [eventId]);

  const handleSendMessage = async () => {
    if (newMessage) {
      await sendMessage(eventId, userId, newMessage); // Trimite mesajul
      setNewMessage(''); // Resetează câmpul de mesaj
      fetchMessages(); // Re-fetch mesajele pentru actualizare
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.$id}>
            <strong>{msg.userId}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
