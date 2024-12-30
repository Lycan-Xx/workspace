import React, { useState } from 'react';
import { User, Settings, PenSquare } from 'lucide-react';

export const Sidebar = ({ currentView, setCurrentView }) => {
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // TODO: Here you would typically upload the file to your server
      // const formData = new FormData();
      // formData.append('image', file);
      // await uploadToServer(formData);
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6">
      <div className="space-y-6">
        <div className="relative flex items-center justify-center mb-8">
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-500"
          />
          <label htmlFor="profile-upload" className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
            <PenSquare size={16} />
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentView('info')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'info' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <User size={20} />
            <span>Profile & Services</span>
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'admin'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Settings size={20} />
            <span>Admin Portal</span>
          </button>
        </nav>
      </div>
    </div>
  );
};