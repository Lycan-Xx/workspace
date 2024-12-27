import React, { useState } from "react";
import { Eye, EyeOff, Edit, Trash2, Plus, Lock, Key, Edit2 } from "lucide-react";

export function Passkeys() {
  const [passkeys, setPasskeys] = useState([
    { id: "1", name: "Gmail", value: "MySecurePass123", visible: false },
    { id: "2", name: "GitHub", value: "AnotherSecurePass456", visible: false },
  ]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [editedName, setEditedName] = useState("");
  const [editedValue, setEditedValue] = useState("");
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");

  const togglePasskeyVisibility = (id) => {
    setPasskeys((prev) =>
      prev.map((pk) =>
        pk.id === id ? { ...pk, visible: !pk.visible } : pk
      )
    );
  };

  const handleEdit = (id) => {
    const passkey = passkeys.find((pk) => pk.id === id);
    setEditedName(passkey.name);
    setEditedValue(passkey.value);
    setSelectedItem(id);
    setEditDialogOpen(true);
  };

  const saveEdit = () => {
    setPasskeys((prev) =>
      prev.map((pk) =>
        pk.id === selectedItem
          ? { ...pk, name: editedName, value: editedValue }
          : pk
      )
    );
    setEditDialogOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = (id) => {
    setSelectedItem(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setPasskeys((prev) => prev.filter((pk) => pk.id !== selectedItem));
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleAdd = () => {
    if (newName && newValue) {
      setPasskeys((prev) => [
        ...prev,
        { id: Date.now().toString(), name: newName, value: newValue, visible: false },
      ]);
      setAddDialogOpen(false);
      setNewName("");
      setNewValue("");
    }
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setAddDialogOpen(true)}
          className="px-4 py-2 border-2 border-blue-500 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 hover:border-blue-600 transition-colors"
        >
          <Plus size={16} />
          Add Passkey
        </button>
      </div>

      <div className="space-y-4">
        {passkeys.map((passkey) => (
          <div
            key={passkey.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:border-blue-500 transition-colors"
          >
            <div>
              <h3 className="font-medium">{passkey.name}</h3>
              <div className="flex items-center gap-2">
                <input
                  type={passkey.visible ? "text" : "password"}
                  value={passkey.value}
                  readOnly
                  className="bg-transparent border-none focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => togglePasskeyVisibility(passkey.id)}
                className="p-2 border-2 border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                {passkey.visible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={() => handleEdit(passkey.id)}
                className="p-2 border-2 border-gray-300 text-blue-500 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(passkey.id)}
                className="p-2 border-2 border-gray-300 text-red-500 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Dialog */}
      {addDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Add Passkey</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="new-name" className="block font-medium">
                  Name
                </label>
                <input
                  id="new-name"
                  className="w-full p-2 border rounded"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="new-value" className="block font-medium">
                  Value
                </label>
                <input
                  id="new-value"
                  className="w-full p-2 border rounded"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setAddDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Edit Passkey</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block font-medium">
                  Name
                </label>
                <input
                  id="edit-name"
                  className="w-full p-2 border rounded"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="edit-value" className="block font-medium">
                  Value
                </label>
                <input
                  id="edit-value"
                  className="w-full p-2 border rounded"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={saveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Delete Passkey</h3>
            <p>Are you sure you want to delete this passkey? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
