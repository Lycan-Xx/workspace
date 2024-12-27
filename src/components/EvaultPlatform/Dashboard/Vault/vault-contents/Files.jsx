import React, { useState } from "react";
import { FileText, Image as ImageIcon, Download, Link, Trash, Plus } from "lucide-react";

function Files() {
  const [files, setFiles] = useState([
    {
      id: "1",
      name: "Document.pdf",
      type: "PDF",
      size: "2.5 MB",
      lastModified: "2024-03-20",
      preview: "This is a preview of Document.pdf.",
    },
    {
      id: "2",
      name: "Image.jpg",
      type: "Image",
      size: "1.8 MB",
      lastModified: "2024-03-19",
      preview: "This is a preview of Image.jpg.",
    },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [newFile, setNewFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prevFiles) => [
        ...prevFiles,
        {
          id: Date.now().toString(),
          name: file.name,
          type: file.type.split("/")[0] || "Unknown",
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          lastModified: new Date(file.lastModified).toISOString().split("T")[0],
          preview: `This is a preview of ${file.name}.`,
        },
      ]);
      setDialogType(null);
    }
  };

  const handleDelete = () => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== selectedItem));
    setDialogType(null);
    setSelectedItem(null);
  };

  const handleShare = (id) => {
    setSelectedItem(id);
    setShareLink(`https://example.com/share/${id}`);
    setDialogType("share");
  };

  const handlePreview = (file) => {
    setSelectedItem(file);
    setDialogType("preview");
  };

  const getFileIcon = (type) => {
    return type.toLowerCase() === "image" ? (
      <ImageIcon className="text-blue-500" />
    ) : (
      <FileText className="text-blue-500" />
    );
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm p-4">
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 border-2 border-blue-500 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 hover:border-blue-600 transition-colors"
          onClick={() => setDialogType("add")}
        >
          <Plus size={16} />
          Add File
        </button>
      </div>

      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getFileIcon(file.type)}
              <div>
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-sm text-gray-600">
                  {file.size} • {file.lastModified}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="p-2 border-2 border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
                onClick={() => alert(`Downloading ${file.name}`)}
              >
                <Download size={16} />
              </button>
              <button
                className="p-2 border-2 border-gray-300 text-blue-500 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                onClick={() => handleShare(file.id)}
              >
                <Link size={16} />
              </button>
              <button
                className="p-2 border-2 border-gray-300 text-red-500 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
                onClick={() => {
                  setSelectedItem(file.id);
                  setDialogType("delete");
                }}
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      {dialogType === "add" && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Upload File</h3>
            <input
              type="file"
              onChange={handleFileUpload}
              className="w-full p-2 border rounded"
            />
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setDialogType(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {dialogType === "delete" && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this file? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setDialogType(null)}
              >
                Cancel
              </button>
              <button
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {dialogType === "share" && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Share File</h3>
            <p>Copy the link below to share the file:</p>
            <input
              type="text"
              value={shareLink}
              readOnly
              onClick={(e) => e.target.select()}
              className="w-full p-2 border rounded"
            />
            <div className="mt-6 flex justify-end">
              <button
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setDialogType(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {dialogType === "preview" && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold">{selectedItem.name}</h3>
            <p>{selectedItem.preview}</p>
            <div className="mt-6 flex justify-end">
              <button
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setDialogType(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Files;
