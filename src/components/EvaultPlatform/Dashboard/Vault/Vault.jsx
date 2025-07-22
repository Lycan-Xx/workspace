import React, { useState } from "react";
import { FiPlus } from 'react-icons/fi';
import { FaVault } from "react-icons/fa6";
import { BsFileEarmarkText, BsKey } from 'react-icons/bs';
import { FaStamp } from "react-icons/fa";
import CategoryCard from './vault-contents/CategoryCard';
import FileList from './vault-contents/FileList';
import UploadModal from './vault-contents/UploadModal';
import PinVerificationModal from '../../common/PinVerificationModal';

function Vault() {
  const [categories] = useState([
    {
      name: "Digital Documents",
      icon: BsFileEarmarkText,
      description: "Store and manage important documents, certificates, and legal agreements",
      items: ["Certificates", "CFO", "Agreements", "Credentials"]
    },
    {
      name: "Keys",
      icon: BsKey,
      description: "Securely store digital keys and access credentials",
      items: ["API Keys", "License Keys", "Access Keys"]
    },
    {
      name: "Stamps and Signatures",
      icon: FaStamp,
      description: "Manage digital signatures, stamps, and seals",
      items: ["Digital Signatures", "Electronic Stamps", "Seals"]
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [files, setFiles] = useState({
    "Certificates": [
      { id: 1, name: "Degree Certificate.pdf", type: "pdf", size: "2.5 MB", date: "2024-03-10" },
      { id: 2, name: "Professional Cert.pdf", type: "pdf", size: "1.8 MB", date: "2024-03-09" }
    ],
    "CFO": [
      { id: 3, name: "Financial Report.xlsx", type: "excel", size: "1.2 MB", date: "2024-03-08" }
    ],
  });

  const [isPinVerified, setIsPinVerified] = useState(false);
  const [showPinModal, setShowPinModal] = useState(true);

  const handlePinVerification = () => {
    setIsPinVerified(true);
    setShowPinModal(false);
  };

  const handleFileUpload = (formData) => {
    const { name, description, category, subcategory, passphrase, file } = formData;
    
    const newFile = {
      id: Date.now(),
      name: name || file.name,
      type: file.type,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      date: new Date().toISOString().split('T')[0],
    };

    setFiles(prevFiles => ({
      ...prevFiles,
      [subcategory]: [...(prevFiles[subcategory] || []), newFile]
    }));

    setIsUploadModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <PinVerificationModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onVerify={handlePinVerification}
      />
      
      <div className={`max-w-7xl mx-auto p-4 sm:p-6 transition-all duration-300 ${
        !isPinVerified ? 'blur-md pointer-events-none' : ''
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaVault className="text-blue-500 text-3xl" />
            <h1 className="text-2xl sm:text-3xl font-bold">Digital Vault</h1>
          </div>
          {!selectedCategory && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiPlus /> Add File
            </button>
          )}
        </div>

        {!selectedCategory ? (
          <div className="grid gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                category={category}
                onSelect={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-4 text-blue-500 hover:text-blue-600 flex items-center gap-2"
            >
              ← Back to Categories
            </button>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <selectedCategory.icon className="text-blue-500 text-2xl" />
                <div>
                  <h2 className="text-xl font-bold">{selectedCategory.name}</h2>
                  <p className="text-gray-600">{selectedCategory.description}</p>
                </div>
              </div>
              
              <FileList
                items={selectedCategory.items}
                files={files}
              />
            </div>
          </div>
        )}

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          categories={categories}
          selectedCategory={selectedCategory}
          onUpload={handleFileUpload}
        />
      </div>
    </div>
  );
}

export default Vault;