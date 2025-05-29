import React, { createContext, useState, useEffect } from "react";

export const AccountsContext = createContext();

export const AccountsProvider = ({ children }) => {
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem("accounts");
    return saved ? JSON.parse(saved) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    active: true,
  });

  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

  const addAccount = (account) => {
    setAccounts((prev) => [...prev, account]);
  };

  const updateAccount = (index, updatedAccount) => {
    setAccounts((prev) =>
      prev.map((acc, i) => (i === index ? updatedAccount : acc))
    );
  };

  const deleteAccount = (index) => {
    setAccounts((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAccountActive = (index) => {
    setAccounts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], active: !updated[index].active };
      return updated;
    });
  };

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        toggleAccountActive,
        form,
        setForm,
        editingIndex,
        setEditingIndex,
        showModal,
        setShowModal,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};
