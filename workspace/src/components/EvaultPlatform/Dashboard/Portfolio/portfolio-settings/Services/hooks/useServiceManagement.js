import { useState } from 'react';

export const useServiceManagement = (initialServices = []) => {
	const [services, setServices] = useState(initialServices);
	const [showModal, setShowModal] = useState(false);
	const [editingIndex, setEditingIndex] = useState(null);
	const [form, setForm] = useState({
		name: '',
		description: '',
		active: true
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		if (editingIndex !== null) {
			// Edit existing service
			setServices(prev => {
				const updated = [...prev];
				updated[editingIndex] = { ...form };
				return updated;
			});
			setEditingIndex(null);
		} else {
			// Add new service
			setServices(prev => [...prev, { ...form }]);
		}
		setForm({ name: '', description: '', active: true });
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
		setForm({ name: '', description: '', active: true });
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
