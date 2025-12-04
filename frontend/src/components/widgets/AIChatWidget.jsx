import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, X } from 'lucide-react';
import { aiAPI } from '../../services/aiAPI';

const AIChatWidget = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your travel assistant. How can I help you plan your trip?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiAPI.chat({ query: input });
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.data,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "Suggest destinations to visit this month",
    "Create a 5-day itinerary for Goa",
    "Find cheap flights from Delhi",
    "Budget-friendly countries for Indian travellers",
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#0CA9A5] text-white p-3 rounded-lg shadow hover:bg-[#0CA9A5] transition-colors"
        >
          <Bot className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-white rounded-lg border border-gray-200 shadow-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#0CA9A5] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="font-medium">Travel Assistant</span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#F7F7F7]">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.sender === 'user'
                    ? 'bg-[#0CA9A5] text-white'
                    : 'bg-white text-[#222222] border border-gray-200'
                } ${message.isError ? 'bg-red-50 text-red-800 border-red-200' : ''}`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin text-[#1e599e]" />
                  <span className="text-sm text-[#767676]">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex flex-wrap gap-1 mb-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInput(question)}
              className="text-xs bg-[#F7F7F7] hover:bg-gray-200 text-[#484848] px-2 py-1 rounded transition-colors"
            >
              {question}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about travel..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:border-[#0CA9A5] focus:ring-1 focus:ring-[#0CA9A5] text-[#222222]"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[#0CA9A5] text-white p-2 rounded hover:bg-[#0CA9A5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatWidget;