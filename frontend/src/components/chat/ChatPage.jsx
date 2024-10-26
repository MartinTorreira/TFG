import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [recipient, setRecipient] = useState('');
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // Crear la conexión del WebSocket
        const socket = new SockJS('http://localhost:8080/chat');
        const client = Stomp.over(socket);

        // Conectar al servidor WebSocket
        client.connect({}, () => {
            console.log('Connected to WebSocket');
            client.subscribe('/topic/messages', (msg) => {
                const newMessage = JSON.parse(msg.body);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        }, (error) => {
            console.error('Error connecting to WebSocket:', error);
        });

        // Guardar la instancia del stompClient
        setStompClient(client);

        // Desconectar cuando el componente se desmonte
        return () => {
            if (client && client.connected) {
                client.disconnect(() => {
                    console.log('Disconnected');
                });
            }
        };
    }, []); // Se ejecuta solo al montar el componente

    const sendMessage = () => {
        if (stompClient && stompClient.connected && message.trim() && recipient.trim()) {
            const chatMessage = {
                sender: Number(1),
                recipient: Number(2),
                content: message,
                timestamp: new Date().toISOString()
            };
            console.log('Enviando mensaje:', JSON.stringify(chatMessage));
            stompClient.send('/app/sendMessage', {}, JSON.stringify(chatMessage));
            setMessage(''); // Limpiar el campo de mensaje
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}</strong> to <strong>{msg.recipient}</strong>: {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                placeholder="Recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
            />
            <input
                type="text"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
