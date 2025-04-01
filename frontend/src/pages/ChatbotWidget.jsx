import { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const newMessage = { text: input, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { text: "I'm here to assist you!", sender: 'bot' }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="bg-[#776B5D] text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Customer Support</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <FaTimes />
            </button>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p className={`p-3 rounded-lg text-sm max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <div className="p-3 border-t flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#776B5D]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-[#776B5D] text-white p-2 rounded-lg hover:bg-[#5D534A] transition">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#776B5D] text-white p-4 rounded-full shadow-lg hover:bg-[#5D534A] transition-colors"
        >
          <FaRobot size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;