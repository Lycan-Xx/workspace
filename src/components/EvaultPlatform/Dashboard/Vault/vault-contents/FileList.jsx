import React, { useState } from 'react';
import { FiEye, FiEdit2, FiTrash2, FiShare2 } from 'react-icons/fi';

function FileList({ items, files }) {
  const [modalState, setModalState] = useState({
    type: null, // 'view', 'edit', 'delete', 'share'
    file: null,
    isOpen: false
  });

  const handleAction = (type, file) => {
    setModalState({ type, file, isOpen: true });
  };

  const renderModal = () => {
    if (!modalState.isOpen) return null;

    const modalContent = {
      view: {
        title: 'View File',
        content: (
          <div className="p-4">
            <h3 className="font-bold mb-2">{modalState.file.name}</h3>
            <p className="text-gray-600">File preview would go here</p>
          </div>
        )
      },
      edit: {
        title: 'Edit File',
        content: (
          <div className="p-4">
            <input
              type="text"
              className="w-full p-2 border rounded"
              defaultValue={modalState.file.name}
            />
          </div>
        )
      },
      delete: {
        title: 'Delete File',
        content: (
          <div className="p-4">
            <p className="text-red-600">Are you sure you want to delete {modalState.file.name}?</p>
            <p className="text-gray-600 mt-2">This action cannot be undone.</p>
          </div>
        )
      },
      share: {
        title: 'Share File',
        content: (
<div className="p-4">
  <p className="mb-2">Share link for {modalState.file.name}:</p>
  <input
    type="text"
    readOnly
    className="w-full p-2 border rounded bg-gray-50"
    value={`https://example.com/share/${modalState.file.id}`}
  />
</div>

        )
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">{modalContent[modalState.type].title}</h2>
            <button
              onClick={() => setModalState({ type: null, file: null, isOpen: false })}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          {modalContent[modalState.type].content}
          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              onClick={() => setModalState({ type: null, file: null, isOpen: false })}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            {modalState.type === 'delete' && (
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
              </button>
            )}
            {modalState.type === 'edit' && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border-b pb-4">
          <h3 className="font-semibold mb-3">{item}</h3>
          
          {files[item]?.length > 0 ? (
            <div className="space-y-2">
              {files[item].map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {file.size} • {new Date(file.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction('view', file)}
                      className="p-2 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                    >
                      <FiEye size={20} />
                    </button>
                    <button
                      onClick={() => handleAction('edit', file)}
                      className="p-2 hover:text-green-500 hover:bg-green-50 rounded-full"
                    >
                      <FiEdit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleAction('delete', file)}
                      className="p-2 hover:text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <FiTrash2 size={20} />
                    </button>
                    <button
                      onClick={() => handleAction('share', file)}
                      className="p-2 hover:text-purple-500 hover:bg-purple-50 rounded-full"
                    >
                      <FiShare2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
              <p>No files yet.</p>
            </div>
          )}
        </div>
      ))}
      {renderModal()}
    </div>
  );
}

export default FileList;