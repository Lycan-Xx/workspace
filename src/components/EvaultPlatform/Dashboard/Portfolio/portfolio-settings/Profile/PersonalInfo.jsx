import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Briefcase, Calendar, Pencil, Save } from 'lucide-react';

export const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState({
    name: 'Musa Audu',
    email: 'musa.audu@example.com',
    phone: '+234 123 456 7890',
    location: 'Lagos, Nigeria',
    occupation: 'Software Developer',
    joinDate: '2023',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  });

  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Handle update logic here
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInfo({ ...info, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <img
            src={info.profilePicture}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-blue-500"
          />
          <button
            onClick={triggerFileInput}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          {isEditing ? <Save className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
          <span>{isEditing ? 'Save Info' : 'Edit Info'}</span>
        </button>
      </div>

      <div className="p-4 md:p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Full Name"
              />
              <input
                type="email"
                value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Email"
              />
              <input
                type="tel"
                value={info.phone}
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Phone"
              />
              <input
                type="text"
                value={info.location}
                onChange={(e) => setInfo({ ...info, location: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Location"
              />
            </div>
            <input
              type="text"
              value={info.occupation}
              onChange={(e) => setInfo({ ...info, occupation: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Occupation"
            />
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{info.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{info.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{info.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Occupation</p>
                <p className="font-medium">{info.occupation}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{info.joinDate}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};