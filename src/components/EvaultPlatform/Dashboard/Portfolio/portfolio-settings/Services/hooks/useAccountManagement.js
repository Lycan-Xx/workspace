import { useState } from 'react';

export const useAccountManagement = () => {
	const [services, setServices] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [editingIndex, setEditingIndex] = useState(null);
	const [form, setForm] = useState({
		bankName: '',
		accountNumber: '',
		accountName: '',
		active: true
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		if (editingIndex !== null) {
			// Edit existing account
			setServices(prev => {
				const updated = [...prev];
				updated[editingIndex] = { ...form };
				return updated;
			});
			setEditingIndex(null);
		} else {
			// Add new account
			setServices(prev => [...prev, { ...form }]);
		}
		setForm({ bankName: '', accountNumber: '', accountName: '', active: true });
		setShowModal(false);
	};

	const handleEdit = (index) => {
		setEditingIndex(index);
		setForm({ ...services[index] });
		setShowModal(true);
	};

	const handleDelete = (index) => {
		setServices(prev => prev.filter((_, i) => i !== index));
	};

	const toggleActive = (index) => {
		setServices(prev => {
			const updated = [...prev];
			updated[index] = { ...updated[index], active: !updated[index].active };
			return updated;
		});
	};

	const handleAddNew = () => {
		setEditingIndex(null);
		setForm({ bankName: '', accountNumber: '', accountName: '', active: true });
		setShowModal(true);
	};

	return {
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
	};
};