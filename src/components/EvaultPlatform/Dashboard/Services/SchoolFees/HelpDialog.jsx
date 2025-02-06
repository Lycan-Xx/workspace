import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const contactOptions = [
  { icon: "📧", text: "Email: contact@school.com", action: "mailto:contact@school.com" },
  { icon: "📞", text: "Phone: +1234567890", action: "tel:+1234567890" },
  { icon: "💬", text: "Live Chat", action: "/livechat" }
];

const HelpDialog = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-50">
        <div className="bg-white shadow-xl rounded-lg w-[calc(100vw-2rem)] sm:w-80 max-w-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              {contactOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.action}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {option.icon}
                  </span>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {option.text}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default HelpDialog;
