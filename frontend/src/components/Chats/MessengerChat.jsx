import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaComments, FaTimes, FaMinus, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';

export default function MessengerButton() {
  const pageUsername = "927998157054506"; 
  const messengerLink = `https://m.me/${pageUsername}`;
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Chào mừng đến với Tech Phone! Chúng tôi sẵn sàng hỗ trợ bạn.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
  };

  //  NÚT CHƯA MỞ POPUP
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
        >
          <FaComments className="text-xl" />
          <span className="hidden sm:inline">Chat với chúng tôi</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-full sm:w-96 h-96 sm:h-[600px] max-w-[calc(100vw-32px)]">
      <div className="bg-white rounded-lg shadow-2xl flex flex-col h-full overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Tech Phone</h3>
            <p className="text-sm opacity-90">Hỗ trợ khách hàng</p>
          </div>

          <div className="flex gap-2">
            {/* NÚT MỞ MESSENGER CHÍNH THỨC */}
            <a
              href={messengerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-white/20 p-2 rounded transition"
              title="Mở Messenger"
            >
              <FaExternalLinkAlt size={18} />
            </a>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-white/20 p-2 rounded transition"
            >
              {isMinimized ? <FaPlus size={18} /> : <FaMinus size={18} />}
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded transition"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm break-words ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-xs opacity-70 block mt-1">
                      {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4 bg-white flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              />

              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaPaperPlane size={18} />
              </button>
            </div>

            {/* Messenger Link */}
            <div className="bg-blue-50 border-t border-blue-200 text-center py-2">
              <a
                href={messengerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium flex items-center justify-center gap-1"
              >
                <FaExternalLinkAlt size={14} /> Mở bằng Messenger
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
