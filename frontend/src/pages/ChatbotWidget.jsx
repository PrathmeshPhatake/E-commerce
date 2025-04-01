import { useState } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          <div className="bg-[#776B5D] text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Customer Support</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Chat messages will go here */}
            <div className="mb-4">
              <p className="bg-gray-100 p-3 rounded-lg">
                Hello! How can I help you today?
              </p>
            </div>
          </div>
          
          <div className="p-3 border-t">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#776B5D]"
            />
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