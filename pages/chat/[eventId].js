import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Client, Databases } from "appwrite";

const ChatPage = () => {
    const router = useRouter();
    const { eventId } = router.query; // Obține ID-ul evenimentului din router
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const client = new Client();
    const databases = new Databases(client);
    
    // Asigură-te că ai ID-ul utilizatorului
    const userId = "6723f8a218494d6800de"; // Înlocuiește cu metoda ta de a obține ID-ul utilizatorului

    useEffect(() => {
        // Inițializează clientul Appwrite
        client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT).setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

        // Verifică dacă eventId este disponibil
        if (!eventId) return;

        // Fetch messages for the specific event
        const fetchMessages = async () => {
            try {
                const response = await databases.listDocuments(process.env.NEXT_PUBLIC_DB_ID, "chat", [
                    {
                        key: "eventId",
                        value: eventId,
                    },
                ]);
                setMessages(response.documents);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
    }, [eventId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;
    
        const messageData = {
            eventId: eventId,
            userId: userId,
            message: newMessage,
            timestamp: new Date().toISOString(),
        };
    
        try {
            await databases.createDocument(process.env.NEXT_PUBLIC_DB_ID, "chat", "unique()", messageData);
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("Eroare la trimiterea mesajului: " + error.message);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-300 flex flex-col">
            <div className="flex-grow max-w-10xl mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col">
                <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Chat for Event {eventId}</h1>
                <div className="messages mb-4 overflow-y-auto flex-grow h-96">
                    {messages.map((msg) => (
                        <div key={msg.$id} className="message p-4 mb-2 border rounded-lg shadow-sm bg-gray-100">
                            <strong className="text-blue-600">User {msg.userId}:</strong> <span>{msg.message}</span>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex mt-4">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition duration-200">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
