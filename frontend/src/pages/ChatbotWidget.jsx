import { useState,useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you with products today?', sender: 'bot' }
  ]);
  const[userId,SetUserId]=useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      console.log("userInfo:",userInfo);
      SetUserId(userInfo._id); 
    }
  }, [userInfo]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const newMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call your API endpoint
      const response = await fetch(`http://localhost:5173/api/ollama/productsuggestion/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Handle the API response
      if (data.response) {
        // Add bot's text response
        setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
        
        // If there are products, format them nicely
        if (data.products && data.products.length > 0) {
          const productList = data.products.map(p => 
            `${p.name} - ₹${p.price} (${p.brand})`
          ).join('\n');
          
          setMessages(prev => [...prev, { 
            text: `Here are some products you might like:\n${productList}`, 
            sender: 'bot' 
          }]);
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't process your request. Please try again.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="bg-[#776B5D] text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Product Assistant</h3>
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
                <div 
                  className={`p-3 rounded-lg text-sm max-w-xs ${msg.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-black'}`}
                  style={{ whiteSpace: 'pre-line' }} // Preserve line breaks
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-gray-200 text-black">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
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
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage} 
              className="bg-[#776B5D] text-white p-2 rounded-lg hover:bg-[#5D534A] transition disabled:opacity-50"
              disabled={isLoading || !input.trim()}
            >
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