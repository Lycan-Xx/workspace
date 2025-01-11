import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Paper,
  FormControlLabel,
  Switch,
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
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(files[0].type)) {
        alert('Please upload an image file (JPEG, PNG, GIF)');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(files[0]);
      setFormData({ ...formData, [name]: previewUrl });

      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Vendor updated successfully!");
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.stopPropagation();
        handleSubmit(e);
      }}
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

      <Box sx={{ position: "relative", mb: 3 }}>
        <Paper
          elevation={3}
          sx={{
            height: 200,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            backgroundImage: formData.topBanner ? `url(${formData.topBanner})` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #ccc',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('topBanner').click()}
        >
          {!formData.topBanner && (
            <Typography variant="body1" color="textSecondary">
              Click to upload top banner
            </Typography>
          )}
        </Paper>
        <input
          type="file"
          id="topBanner"
          name="topBanner"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              height: 200,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 2,
              backgroundImage: formData.leftBanner ? `url(${formData.leftBanner})` : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #ccc',
              cursor: 'pointer',
            }}
            onClick={() => document.getElementById('leftBanner').click()}
          >
            {!formData.leftBanner && (
              <Typography variant="body1" color="textSecondary">
                Click to upload left banner
              </Typography>
            )}
          </Paper>
          <input
            type="file"
            id="leftBanner"
            name="leftBanner"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
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

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Active Accounts
        </Typography>
        <Accounts />
      </Box>

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
