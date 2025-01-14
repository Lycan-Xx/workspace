import React from 'react';
import { useAccountManagement } from './hooks/useAccountManagement';
import { Pencil, Trash, Plus, Save, X } from 'lucide-react';

const Accounts = () => {
  const {
    services: accounts,
    showModal,
    form,
    editingIndex,
    handleChange,
    handleSave,
    handleEdit,
    handleDelete,
    toggleActive,
    handleAddNew,
    setShowModal,
  } = useAccountManagement();

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Account Management</h1>
        <button
          onClick={handleAddNew}
		  type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add New Account
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-lg">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={form.bankName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                  <input
                    type="text"
                    name="accountName"
                    value={form.accountName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  {editingIndex !== null ? (
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
          </div>
        </div>
      )}

      <div className="space-y-4">
        {accounts.map((account, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              account.active ? 'border-green-400' : 'border-gray-200'
            } transition-colors`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-800">{account.bankName}</h3>
                <p className="text-sm text-gray-600">
                  {account.accountName} - {account.accountNumber}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={account.active}
                      onChange={() => toggleActive(index)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 peer-not-checked:bg-red-500"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700">
                      {account.active ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
                <button
                  onClick={() => handleEdit(index)}
				  type="button"
                  className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No accounts added yet. Click the "Add New Account" button to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;