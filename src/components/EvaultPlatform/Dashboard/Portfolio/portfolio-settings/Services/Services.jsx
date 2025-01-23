import React, { useState } from "react";
import {
	Button,
	Typography,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Box,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Switch,
	IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useServiceManagement } from "./hooks/useServiceManagement";

const categories = {
	Restaurants: ["Fast Food", "Fine Dining", "Cafes"],
	Shops: ["Grocery", "Electronics", "Clothing"],
	"Service Providers": ["Cleaning", "Plumbing", "Electrical"],
	"Health & Wellness": ["Gym", "Spa", "Yoga"],
	"School Fees": ["Primary 1", "JSS 1", "SSS 1", "P.T.A", "Others"],
};

const Services = () => {
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedSubCategory, setSelectedSubCategory] = useState("");

	const serviceManagement = useServiceManagement([]);

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
	} = serviceManagement;

	return (
		<Box
			sx={{
				width: "100%",
				maxWidth: "900px",
				mx: "auto",
				mt: 4,
				p: 3,
				bgcolor: "background.paper",
				borderRadius: 2,
				boxShadow: 3,
			}}
		>
			<Box
				sx={{
					mb: 4,
					py: 2,
					px: 3,
					textAlign: "center",
					bgcolor: "white",
					borderRadius: 2,
				}}
			>
				<Typography variant="h5" sx={{ fontWeight: "bold", color: "dark", mb: 1 }}>
					Service Management
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Organize your services effectively with tools to add, edit, delete, and activate or deactivate them easily.
				</Typography>
			</Box>

			<Box sx={{ textAlign: "right", mb: 3 }}>
				<Button
					variant="contained"
					startIcon={<Add />}
					onClick={() => setShowModal(true)}
					sx={{ textTransform: "none" }}
				>
					Add New Service
				</Button>
			</Box>

			<Box
				component={motion.div}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				sx={{
					maxHeight: "400px",
					overflowY: "auto",
					pr: 1,
					"&::-webkit-scrollbar": {
						width: "8px",
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "rgba(0,0,0,0.2)",
						borderRadius: "4px",
					},
				}}
			>
				{services.map((item, index) => (
					<Box
						component={motion.div}
						key={index}
						whileHover={{ scale: 1.01 }}
						transition={{ duration: 0.2 }}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							p: 2,
							mb: 1,
							borderRadius: 2,
							bgcolor: "grey.100",
							boxShadow: 2,
						}}
					>
						<Box sx={{ flex: 1 }}>
							<Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
								{item.name}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{item.description}
							</Typography>
						</Box>
						<Switch
							checked={item.active}
							onChange={() => toggleActive(index)}
							color="primary"
							inputProps={{ "aria-label": "Activate/Deactivate" }}
						/>
						<IconButton color="warning" onClick={() => handleEdit(index)}>
							<Edit />
						</IconButton>
						<IconButton color="error" onClick={() => handleDelete(index)}>
							<Delete />
						</IconButton>
					</Box>
				))}
			</Box>

			<Dialog
				open={showModal}
				onClose={() => setShowModal(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>
					{editingIndex !== null ? "Edit Service" : "Add New Service"}
				</DialogTitle>
				<DialogContent>
					<FormControl fullWidth margin="dense">
						<InputLabel>Category</InputLabel>
						<Select
							value={selectedCategory}
							onChange={(e) => {
								setSelectedCategory(e.target.value);
								setSelectedSubCategory("");
							}}
						>
							{Object.keys(categories).map((cat) => (
								<MenuItem key={cat} value={cat}>
									{cat}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl fullWidth margin="dense" disabled={!selectedCategory}>
						<InputLabel>Subcategory</InputLabel>
						<Select
							value={selectedSubCategory}
							onChange={(e) => setSelectedSubCategory(e.target.value)}
						>
							{categories[selectedCategory]?.map((sub) => (
								<MenuItem key={sub} value={sub}>
									{sub}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						label="Name"
						name="name"
						value={form.name}
						onChange={handleChange}
						fullWidth
						margin="dense"
					/>
					<TextField
						label="Description"
						name="description"
						value={form.description}
						onChange={handleChange}
						fullWidth
						margin="dense"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowModal(false)} color="error">
						Cancel
					</Button>
					<Button onClick={handleSave} variant="contained" color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default Services;
