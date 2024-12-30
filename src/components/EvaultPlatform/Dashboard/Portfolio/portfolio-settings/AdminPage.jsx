import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import { UploadFile, Save, Cancel } from "@mui/icons-material";
import Accounts from "./Services/Accounts";

const AdminPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    topBanner: "",
    leftBanner: "",
    businessName: "",
    contactEmail: "",
    contactPhone: "",
    paymentOptions: {
      card: false,
      transfer: false,
      ussd: false,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      paymentOptions: {
        ...formData.paymentOptions,
        [name]: checked,
      },
    });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, [name]: event.target.result });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      alert("Vendor updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update vendor.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 900,
        mx: "auto",
        my: 4,
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
        Portal Preference
      </Typography>

      {/* Top Banner Section */}
      <Box sx={{ position: "relative", mb: 3 }}>
        <Paper
          elevation={3}
          sx={{
            height: 200,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            backgroundImage: `url(${formData.topBanner || ""})`,
          }}
        />
        <Button
          component="label"
          startIcon={<UploadFile />}
          sx={{ mt: 2 }}
          variant="contained"
        >
          Upload Top Banner
          <input
            name="topBanner"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </Button>
      </Box>

      {/* Left Banner and Contact Info Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              height: 200,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 2,
              backgroundImage: `url(${formData.leftBanner || ""})`,
            }}
          />
          <Button
            component="label"
            startIcon={<UploadFile />}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Upload Left Banner
            <input
              name="leftBanner"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </Button>
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            name="businessName"
            label="Business Name"
            fullWidth
            value={formData.businessName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="contactEmail"
            label="Contact Email"
            fullWidth
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="contactPhone"
            label="Contact Phone"
            fullWidth
            type="tel"
            value={formData.contactPhone}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      {/* Payment Options */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Options
        </Typography>
        {[
          { option: "card", label: "Credit/Debit Card" },
          { option: "transfer", label: "Bank Transfer" },
          { option: "ussd", label: "USSD Payment" },
        ].map(({ option, label }) => (
          <FormControlLabel
            key={option}
            control={
              <Switch
                checked={formData.paymentOptions[option]}
                onChange={handleCheckboxChange}
                name={option}
              />
            }
            label={label}
          />
        ))}
      </Box>

      {/* Accounts Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Active Accounts
        </Typography>
        <Accounts />
      </Box>

      {/* Submit Button */}
      <Box textAlign="center">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<Save />}
          sx={{ mr: 2 }}
        >
          Update Vendor
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Cancel />}
          onClick={() => setFormData({ ...formData })}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default AdminPage;
