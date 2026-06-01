'use client';

import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your Ayurvedic Asthma Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: data.error || 'Sorry, I encountered an error connecting to the AI.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Network error. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <Bot size={28} className="text-primary" />
          <h2>AyurBreath AI Chat</h2>
          <p>Ask anything about asthma, doshas, or your routine</p>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble-container ${msg.role === 'user' ? 'user' : 'bot'}`}>
              <div className="chat-avatar">
                {msg.role === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="chat-bubble">
                {msg.role === 'bot' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble-container bot">
              <div className="chat-avatar"><Bot size={20} /></div>
              <div className="chat-bubble typing">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              </div>
            </div>
          )}
        </div>

        <div className="chatbot-input-area">
          <input 
            type="text" 
            placeholder="Type your health query here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="btn-primary send-btn">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
