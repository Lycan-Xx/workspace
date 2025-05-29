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
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  UploadFile as UploadIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Power as PowerIcon,
} from "@mui/icons-material";
import Accounts from "./Services/Accounts.jsx";
import { toast, ToastContainer } from 'react-toastify';
import Chip from "@mui/material/Chip";
import 'react-toastify/dist/ReactToastify.css';

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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Form change:', name, value); // Debug log
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
        toast.error('Please upload an image file (JPEG, PNG, GIF)');
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
    console.log('Form submitted:', formData); // Debug log
    setIsLoading(true);
    console.log("Form submitted:", formData);
    alert("Vendor updated successfully!");
    setIsLoading(false);
  };

  const handleEdit = (index) => {
    // Implement edit functionality
  };

  const handleDelete = (index) => {
    // Implement delete functionality
  };

  const toggleActive = (index) => {
    // Implement toggle active functionality
  };

  const handleCancel = () => {
    // Implement cancel functionality
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Portal Preference
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Banner Upload Section */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
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
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#1976d2',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                  onClick={() => document.getElementById('topBanner').click()}
                >
                  {!formData.topBanner && (
                    <Box sx={{ textAlign: 'center' }}>
                      <UploadIcon sx={{ fontSize: 48, color: '#666' }} />
                      <Typography variant="body1" color="textSecondary">
                        Click to upload top banner
                      </Typography>
                    </Box>
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
            </Grid>

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

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              Update Vendor
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setFormData({ ...formData })}
            >
              Reset
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Accounts List */}
      <Grid container spacing={3}>
        {accounts.map((account, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {account.bankName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {account.accountName} - {account.accountNumber}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Chip
                    label={account.active ? 'Active' : 'Inactive'}
                    color={account.active ? 'success' : 'default'}
                    size="small"
                  />
                  <Typography variant="caption" color="textSecondary">
                    Last modified: {new Date(account.lastModified).toLocaleDateString()}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleEdit(index)}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={account.active ? 'Deactivate' : 'Activate'}>
                    <IconButton
                      onClick={() => toggleActive(index)}
                      color={account.active ? 'primary' : 'default'}
                      size="small"
                    >
                      <PowerIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => handleDelete(index)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminPage;
