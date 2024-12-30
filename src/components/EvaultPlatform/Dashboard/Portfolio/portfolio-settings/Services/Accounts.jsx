import React from "react";
import { Pencil, Trash, Plus, Power } from "lucide-react";
import { useAccountManagement } from "./hooks/useAccountManagement";
import { Modal } from "./components/Modal";

const Accounts = () => {
  const {
    services,
    showModal,
    form,
    editingIndex,
    setShowModal,
    handleChange,
    handleSave,
    handleEdit,
    handleDelete,
    toggleActive,
    handleAddNew
  } = useAccountManagement();

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-8xl border-[0.5rem]">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition duration-200"
        >
          <Plus className="h-5 w-5" />
          Add New
        </button>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={index} className="flex justify-between items-center border-b pb-4">
            <div>
              <p className="font-medium">{service.bankName}</p>
              <p className="text-sm text-gray-600">
                {service.accountName} - {service.accountNumber}
              </p>
              <p className={`text-sm ${service.active ? "text-green-600" : "text-red-600"}`}>
                {service.active ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(index)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2 transition duration-200"
              >
                <Pencil className="h-5 w-5" />
                Edit
              </button>
              <button
                onClick={() => toggleActive(index)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200 ${
                  service.active ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-white hover:bg-gray-500"
                }`}
              >
                <Power className="h-5 w-5" />
                {service.active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition duration-200"
              >
                <Trash className="h-5 w-5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title={editingIndex !== null ? "Edit Account" : "Add New Account"}
        onSave={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          handleSave();
        }}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Name</label>
            <input
              type="text"
              name="accountName"
              value={form.accountName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Accounts;