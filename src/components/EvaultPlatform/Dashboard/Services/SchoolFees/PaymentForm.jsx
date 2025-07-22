import React from "react";
import clsx from "clsx";

const PaymentForm = ({ formData, setFormData, onProceed, loading }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col justify-center space-y-6">
      <h3 className="text-lg sm:text-xl font-bold">Enter Payment Details</h3>
      {["studentName", "email", "text", "amount", "classLevel"].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium">
            {field === "studentName"
              ? "Student's Name"
              : field === "email"
              ? "Email Address (Optional)"
              : field === "text"
              ? "What are you paying for (Optional)"
              : field === "amount"
              ? "Amount"
              : "Select Class"}
          </label>
          <input
            type={field === "amount" ? "number" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={`Enter ${field}`}
            className="border p-2 rounded w-full"
          />
        </div>
      ))}
      <button
        onClick={onProceed}
        disabled={!formData.studentName || !formData.amount || !formData.classLevel || loading}
        className={clsx(
          "mt-6 px-6 py-3 rounded-md text-white font-bold text-sm transition duration-500",
          formData.studentName && formData.amount && formData.classLevel
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-300 cursor-not-allowed"
        )}
      >
        {loading ? "Processing..." : "Proceed"}
      </button>
    </div>
  );
};

export default PaymentForm;
