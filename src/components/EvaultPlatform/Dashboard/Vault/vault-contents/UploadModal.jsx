import React, { useState } from 'react';
import { X } from 'lucide-react';

function UploadModal({ isOpen, onClose, categories, selectedCategory, onUpload }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: selectedCategory ? selectedCategory.name : '',
    subcategory: '',
    passphrase: '',
    file: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.file && formData.subcategory) {
      onUpload(formData);
      setFormData({
        name: '',
        description: '',
        category: selectedCategory ? selectedCategory.name : '',
        subcategory: '',
        passphrase: '',
        file: null
      });
    }
  };

  if (!isOpen) return null;

  const currentCategory = selectedCategory || 
    categories.find(cat => cat.name === formData.category) || 
    categories[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload File</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">File Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {!selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Subcategory</label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.subcategory}
              onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
              required
            >
              <option value="">Select a subcategory</option>
              {currentCategory.items.map((item, idx) => (
                <option key={idx} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Passphrase (Optional)</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.passphrase}
              onChange={(e) => setFormData({...formData, passphrase: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">File</label>
            <input
              type="file"
              className="mt-1 block w-full"
              onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition-colors"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadModal;