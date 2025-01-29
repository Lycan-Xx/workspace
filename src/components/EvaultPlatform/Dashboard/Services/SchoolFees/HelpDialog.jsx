import React from "react";

const HelpDialog = ({ isDialogOpen, setIsDialogOpen }) => {
  if (!isDialogOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 bg-white shadow-lg rounded-lg p-4 w-64">
      <h3 className="text-lg font-bold mb-2">Contact Us</h3>
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => (window.location.href = "mailto:contact@school.com")}
          className="border p-2 rounded-lg bg-white hover:bg-blue-300 transition duration-200 flex items-center space-x-2"
        >
          <span>📧</span>
          <span>Email: contact@school.com</span>
        </button>
        <button
          onClick={() => (window.location.href = "tel:+1234567890")}
          className="border p-2 rounded-lg bg-white hover:bg-blue-300 transition duration-200 flex items-center space-x-2"
        >
          <span>📞</span>
          <span>Phone: +1234567890</span>
        </button>
        <button
          onClick={() => (window.location.href = "/livechat")}
          className="border p-2 rounded-lg bg-white hover:bg-blue-300 transition duration-200 flex items-center space-x-2"
        >
          <span>💬</span>
          <span>Live Chat</span>
        </button>
      </div>
      <button
        onClick={() => setIsDialogOpen(false)}
        className="mt-4 text-sm text-gray-500 underline"
      >
        Close
      </button>
    </div>
  );
};

export default HelpDialog;
