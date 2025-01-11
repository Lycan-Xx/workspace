import React, { useState } from "react";
import { Pencil, Trash, Plus, Power, Save, X } from "lucide-react";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    active: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      setAccounts(prev =>
        prev.map((account, idx) =>
          idx === editingId ? { ...formData } : account
        )
      );
      setEditingId(null);
    } else {
      setAccounts(prev => [...prev, { ...formData }]);
    }
    setFormData({
      bankName: "",
      accountName: "",
      accountNumber: "",
      active: true
    });
  };

  const handleEdit = (index) => {
    setEditingId(index);
    setFormData(accounts[index]);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      setAccounts(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const toggleActive = (index) => {
    setAccounts(prev =>
      prev.map((account, idx) =>
        idx === index ? { ...account, active: !account.active } : account
      )
    );
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      bankName: "",
      accountName: "",
      accountNumber: "",
      active: true
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Name</label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          {editingId !== null && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
            >
              <X className="h-5 w-5" />
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            {editingId !== null ? (
              <>
                <Save className="h-5 w-5" />
                Update
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Add Account
              </>
            )}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {accounts.map((account, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              editingId === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{account.bankName}</h3>
                <p className="text-sm text-gray-600">
                  {account.accountName} - {account.accountNumber}
                </p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    account.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {account.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => toggleActive(index)}
                  className={`p-2 rounded-lg transition-colors ${
                    account.active
                      ? "text-blue-600 hover:bg-blue-100"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Power className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
