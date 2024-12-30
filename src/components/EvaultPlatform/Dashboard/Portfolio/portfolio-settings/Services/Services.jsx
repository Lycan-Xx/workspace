import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  Tooltip,
  Box,
  Tab,
  Tabs,
  Grid,
} from "@mui/material";
import { Add, Edit, Delete, ToggleOn, ToggleOff } from "@mui/icons-material";
import { useServiceManagement } from "./hooks/useServiceManagement";

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("Class Names");
  const classNamesManagement = useServiceManagement([]);
  const paymentTypesManagement = useServiceManagement([]);

  const currentManagement =
    activeCategory === "Class Names" ? classNamesManagement : paymentTypesManagement;

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
  } = currentManagement;

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", mx: "auto", mt: 4, p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
      {/* Category Tabs */}
      <Tabs
        value={activeCategory}
        onChange={(e, newValue) => setActiveCategory(newValue)}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Class Names" value="Class Names" />
        <Tab label="Payment Types" value="Payment Types" />
      </Tabs>

      {/* Add Button */}
      <Box sx={{ textAlign: "right", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowModal(true)}
          sx={{ textTransform: "none" }}
        >
          Add New {activeCategory}
        </Button>
      </Box>

      {/* Service Cards */}
      <Grid container spacing={2}>
        {services.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: item.active ? "success.main" : "error.main", fontWeight: "bold" }}
                >
                  {item.active ? "Active" : "Inactive"}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between" }}>
                <Tooltip title="Edit">
                  <Button
                    size="small"
                    color="warning"
                    startIcon={<Edit />}
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip title={item.active ? "Deactivate" : "Activate"}>
                  <Button
                    size="small"
                    color={item.active ? "primary" : "secondary"}
                    startIcon={item.active ? <ToggleOff /> : <ToggleOn />}
                    onClick={() => toggleActive(index)}
                  >
                    {item.active ? "Deactivate" : "Activate"}
                  </Button>
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for Add/Edit */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingIndex !== null ? `Edit ${activeCategory}` : `Add New ${activeCategory}`}
        </DialogTitle>
        <DialogContent>
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
