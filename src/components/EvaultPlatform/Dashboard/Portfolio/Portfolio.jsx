import React, { useState, useRef, useEffect } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  UploadFile as UploadIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Power as PowerIcon,
  Add,
} from "@mui/icons-material";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Pencil,
  Save,
  User,
  Settings,
  History,
  Printer,
  Share2,
  X,
  ArrowDown,
  Plus,
  Minus,
  Trash,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import Chip from "@mui/material/Chip";
import clsx from "clsx";
import 'react-toastify/dist/ReactToastify.css';

// Embedded transaction history data
const transferHistoryData = [
  {
    "id": 1,
    "type": "incoming",
    "senderName": "John Doe",
    "recipientName": "You",
    "amount": 250.75,
    "referenceNumber": "REF123456",
    "date": "2024-12-20",
    "time": "14:35"
  },
  {
    "id": 2,
    "type": "outgoing",
    "senderName": "You",
    "recipientName": "Jane Smith",
    "amount": 500.00,
    "referenceNumber": "REF789012",
    "date": "2024-12-19",
    "time": "09:15"
  },
  {
    "id": 3,
    "type": "incoming",
    "senderName": "Alice Johnson",
    "recipientName": "You",
    "amount": 120.00,
    "referenceNumber": "REF345678",
    "date": "2024-12-18",
    "time": "18:50"
  },
  {
    "id": 4,
    "type": "outgoing",
    "senderName": "You",
    "recipientName": "Bob Lee",
    "amount": 75.50,
    "referenceNumber": "REF901234",
    "date": "2024-12-17",
    "time": "21:10"
  },
  {
    "id": 5,
    "type": "incoming",
    "senderName": "Charlie Brown",
    "recipientName": "You",
    "amount": 300.00,
    "referenceNumber": "REF567890",
    "date": "2024-12-16",
    "time": "12:45"
  },
  {
    "id": 6,
    "type": "outgoing",
    "senderName": "You",
    "recipientName": "Diana Prince",
    "amount": 220.25,
    "referenceNumber": "REF112233",
    "date": "2024-12-15",
    "time": "08:30"
  },
  {
    "id": 7,
    "type": "incoming",
    "senderName": "Eve Adams",
    "recipientName": "You",
    "amount": 400.00,
    "referenceNumber": "REF445566",
    "date": "2024-12-14",
    "time": "16:20"
  },
  {
    "id": 8,
    "type": "outgoing",
    "senderName": "You",
    "recipientName": "Frank Castle",
    "amount": 50.00,
    "referenceNumber": "REF778899",
    "date": "2024-12-13",
    "time": "19:05"
  },
  {
    "id": 9,
    "type": "incoming",
    "senderName": "Grace Hopper",
    "recipientName": "You",
    "amount": 600.00,
    "referenceNumber": "REF990011",
    "date": "2024-12-12",
    "time": "10:15"
  },
  {
    "id": 10,
    "type": "outgoing",
    "senderName": "You",
    "recipientName": "Hank Pym",
    "amount": 180.75,
    "referenceNumber": "REF223344",
    "date": "2024-12-11",
    "time": "13:25"
  }
];

// Service categories
const serviceCategories = {
  Restaurants: ["Fast Food", "Fine Dining", "Cafes"],
  Shops: ["Grocery", "Electronics", "Clothing"],
  "Service Providers": ["Cleaning", "Plumbing", "Electrical"],
  "Health & Wellness": ["Gym", "Spa", "Yoga"],
  "School Fees": ["Primary 1", "JSS 1", "SSS 1", "P.T.A", "Others"],
};

const Portfolio = () => {
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Musa Audu',
    email: 'musa.audu@example.com',
    phone: '+234 123 456 7890',
    location: 'Lagos, Nigeria',
    occupation: 'Software Developer',
    joinDate: '2023',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  });
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const fileInputRef = useRef(null);

  // Admin Settings State
  const [adminFormData, setAdminFormData] = useState({
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
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // Services State
  const [services, setServices] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    active: true
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Accounts State
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem("accounts");
    return saved ? JSON.parse(saved) : [];
  });
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccountIndex, setEditingAccountIndex] = useState(null);
  const [accountForm, setAccountForm] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    active: true,
  });

  // Transaction History State
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [visibleHistories, setVisibleHistories] = useState(6);

  // Save accounts to localStorage whenever accounts change
  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

  // Personal Info Handlers
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    setIsEditingPersonal(false);
    toast.success("Personal information updated successfully!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalInfo({ ...personalInfo, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Admin Settings Handlers
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData({ ...adminFormData, [name]: value });
  };

  const handleAdminCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAdminFormData({
      ...adminFormData,
      paymentOptions: {
        ...adminFormData.paymentOptions,
        [name]: checked,
      },
    });
  };

  const handleAdminImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(files[0].type)) {
        toast.error('Please upload an image file (JPEG, PNG, GIF)');
        return;
      }
      const previewUrl = URL.createObjectURL(files[0]);
      setAdminFormData({ ...adminFormData, [name]: previewUrl });
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setIsLoadingAdmin(true);
    setTimeout(() => {
      setIsLoadingAdmin(false);
      toast.success("Vendor updated successfully!");
    }, 1000);
  };

  // Service Management Handlers
  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceForm(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceSave = () => {
    if (editingServiceIndex !== null) {
      setServices(prev => {
        const updated = [...prev];
        updated[editingServiceIndex] = { ...serviceForm };
        return updated;
      });
      setEditingServiceIndex(null);
    } else {
      setServices(prev => [...prev, { ...serviceForm }]);
    }
    setServiceForm({ name: '', description: '', active: true });
    setShowServiceModal(false);
    setSelectedCategory("");
    setSelectedSubCategory("");
    toast.success(editingServiceIndex !== null ? "Service updated!" : "Service added!");
  };

  const handleServiceEdit = (index) => {
    setEditingServiceIndex(index);
    setServiceForm({ ...services[index] });
    setShowServiceModal(true);
  };

  const handleServiceDelete = (index) => {
    setServices(prev => prev.filter((_, i) => i !== index));
    toast.success("Service deleted!");
  };

  const toggleServiceActive = (index) => {
    setServices(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], active: !updated[index].active };
      return updated;
    });
  };

  // Account Management Handlers
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAccountSave = () => {
    if (editingAccountIndex !== null) {
      setAccounts(prev => {
        const updated = [...prev];
        updated[editingAccountIndex] = { ...accountForm, lastModified: new Date().toISOString() };
        return updated;
      });
      setEditingAccountIndex(null);
    } else {
      setAccounts(prev => [...prev, { ...accountForm, lastModified: new Date().toISOString() }]);
    }
    setAccountForm({ bankName: '', accountNumber: '', accountName: '', active: true });
    setShowAccountModal(false);
    toast.success(editingAccountIndex !== null ? "Account updated!" : "Account added!");
  };

  const handleAccountEdit = (index) => {
    setEditingAccountIndex(index);
    setAccountForm({ ...accounts[index] });
    setShowAccountModal(true);
  };

  const handleAccountDelete = (index) => {
    setAccounts(prev => prev.filter((_, i) => i !== index));
    toast.success("Account deleted!");
  };

  const toggleAccountActive = (index) => {
    setAccounts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], active: !updated[index].active };
      return updated;
    });
  };

  const handleAddNewAccount = () => {
    setEditingAccountIndex(null);
    setAccountForm({ bankName: '', accountNumber: '', accountName: '', active: true });
    setShowAccountModal(true);
  };

  // Transaction History Handlers
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Transaction Details",
        text: `Transaction from ${selectedTransaction.senderName} to ${selectedTransaction.recipientName} for ${selectedTransaction.amount}. Reference: ${selectedTransaction.referenceNumber}`,
      });
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  const handleSaveToVault = () => {
    toast.success("This transaction has been saved to your vault!");
  };

  const loadMoreHistories = () => {
    setVisibleHistories((prev) => prev + 5);
  };

  return (
    <div className="portfolio min-w-0 w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 overflow-x-hidden transition-all duration-300">
        <div className="w-full space-y-6">
          
          {/* Personal Information Section */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <img
                  src={personalInfo.profilePicture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-blue-500"
                />
                <button
                  onClick={triggerFileInput}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <button
                onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                {isEditingPersonal ? <Save className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                <span>{isEditingPersonal ? 'Save Info' : 'Edit Info'}</span>
              </button>
            </div>

            <div className="p-4 md:p-6">
              {isEditingPersonal ? (
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={personalInfo.name}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Email"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Phone"
                    />
                    <input
                      type="text"
                      name="location"
                      value={personalInfo.location}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Location"
                    />
                  </div>
                  <input
                    type="text"
                    name="occupation"
                    value={personalInfo.occupation}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Occupation"
                  />
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{personalInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{personalInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{personalInfo.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Occupation</p>
                      <p className="font-medium">{personalInfo.occupation}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">{personalInfo.joinDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Admin Settings Section */}
          <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Portal Preference
              </Typography>
              
              <form onSubmit={handleAdminSubmit}>
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
                          backgroundImage: adminFormData.topBanner ? `url(${adminFormData.topBanner})` : 'none',
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
                        {!adminFormData.topBanner && (
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
                        onChange={handleAdminImageChange}
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
                        backgroundImage: adminFormData.leftBanner ? `url(${adminFormData.leftBanner})` : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed #ccc',
                        cursor: 'pointer',
                      }}
                      onClick={() => document.getElementById('leftBanner').click()}
                    >
                      {!adminFormData.leftBanner && (
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
                      onChange={handleAdminImageChange}
                      style={{ display: 'none' }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      name="businessName"
                      label="Business Name"
                      fullWidth
                      value={adminFormData.businessName}
                      onChange={handleAdminChange}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      name="contactEmail"
                      label="Contact Email"
                      fullWidth
                      type="email"
                      value={adminFormData.contactEmail}
                      onChange={handleAdminChange}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      name="contactPhone"
                      label="Contact Phone"
                      fullWidth
                      type="tel"
                      value={adminFormData.contactPhone}
                      onChange={handleAdminChange}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      name="description"
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      value={adminFormData.description}
                      onChange={handleAdminChange}
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
                          checked={adminFormData.paymentOptions[option]}
                          onChange={handleAdminCheckboxChange}
                          name={option}
                        />
                      }
                      label={label}
                    />
                  ))}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoadingAdmin}
                    startIcon={isLoadingAdmin ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    Update Vendor
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setAdminFormData({ ...adminFormData })}
                  >
                    Reset
                  </Button>
                </Box>
              </form>
            </Paper>
          </Box>

          {/* Service Management Section */}
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
                onClick={() => setShowServiceModal(true)}
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
                    onChange={() => toggleServiceActive(index)}
                    color="primary"
                    inputProps={{ "aria-label": "Activate/Deactivate" }}
                  />
                  <IconButton color="warning" onClick={() => handleServiceEdit(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleServiceDelete(index)}>
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Dialog
              open={showServiceModal}
              onClose={() => setShowServiceModal(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>
                {editingServiceIndex !== null ? "Edit Service" : "Add New Service"}
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
                    {Object.keys(serviceCategories).map((cat) => (
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
                    {serviceCategories[selectedCategory]?.map((sub) => (
                      <MenuItem key={sub} value={sub}>
                        {sub}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Name"
                  name="name"
                  value={serviceForm.name}
                  onChange={handleServiceChange}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Description"
                  name="description"
                  value={serviceForm.description}
                  onChange={handleServiceChange}
                  fullWidth
                  margin="dense"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowServiceModal(false)} color="error">
                  Cancel
                </Button>
                <Button onClick={handleServiceSave} variant="contained" color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          {/* Account Management Section */}
          <div className="p-6 space-y-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">Account Management</h1>
              <button
                onClick={handleAddNewAccount}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Account</span>
              </button>
            </div>

            {showAccountModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-lg">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAccountSave();
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={accountForm.bankName}
                      onChange={handleAccountChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                    <input
                      type="text"
                      name="accountName"
                      value={accountForm.accountName}
                      onChange={handleAccountChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={accountForm.accountNumber}
                      onChange={handleAccountChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAccountModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2 transition-colors"
                  >
                    <X className="h-5 w-5" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                  >
                    {editingAccountIndex !== null ? (
                      <>
                        <Save className="h-5 w-5" />
                        Update
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        Add Account
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                account.active ? 'border-green-400' : 'border-gray-200'
              } transition-colors`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{account.bankName}</h3>
                  <p className="text-sm text-gray-600">
                    {account.accountName} - {account.accountNumber}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={account.active}
                        onChange={() => toggleAccountActive(index)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 peer-not-checked:bg-red-500"></div>
                      <span className="ms-3 text-sm font-medium text-gray-700">
                        {account.active ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                  </div>
                  <button
                    onClick={() => handleAccountEdit(index)}
                    type="button"
                    className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleAccountDelete(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {accounts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No accounts added yet. Click the "Add New Account" button to get started.
            </div>
          )}
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-xl shadow-sm p-3 md:p-6 overflow-x-hidden">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
          Transaction History
        </h2>
        <div className="p-6 bg-white rounded-md shadow-md space-y-4 transition duration-500">
          <h4 className="text-2xl font-bold flex items-center">
            <History className="w-6 h-6 mr-2 text-gray-600" /> Transfer History
          </h4>

          <ul className="space-y-4">
            {transferHistoryData.slice(0, visibleHistories).map((history) => {
              const isIncoming = history.type === "incoming";
              return (
                <li
                  key={history.id}
                  onClick={() => setSelectedTransaction(history)}
                  className={clsx(
                    "p-4 border rounded-md shadow-sm cursor-pointer transition-all duration-100 hover:border-4",
                    isIncoming ? "border-green-500 hover:border-green-700" : "border-red-500 hover:border-red-700"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {isIncoming ? (
                        <Plus className="w-5 h-5 text-green-500" />
                      ) : (
                        <Minus className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-medium">{history.date}</span>
                    </div>
                    <span className="font-semibold">${history.amount.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-700">
                    <p>
                      <strong>Sender:</strong> {history.senderName}
                    </p>
                    <p>
                      <strong>Reference:</strong> {history.referenceNumber}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {visibleHistories < transferHistoryData.length && (
            <button
              onClick={loadMoreHistories}
              className="flex items-center justify-center w-full md:w-1/4 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition duration-300"
            >
              Load More
            </button>
          )}

          {selectedTransaction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 relative">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>

                <h4 className="text-xl font-bold text-center text-blue-600">Transaction Summary</h4>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Sender:</strong> {selectedTransaction.senderName}
                  </p>
                  <p>
                    <strong>Recipient:</strong> {selectedTransaction.recipientName}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${selectedTransaction.amount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Reference Number:</strong> {selectedTransaction.referenceNumber}
                  </p>
                  <p>
                    <strong>Date & Time:</strong> {selectedTransaction.date} at {selectedTransaction.time}
                  </p>
                </div>

                <div className="flex justify-center space-x-4 pt-4">
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={handleSaveToVault}
                    className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                  >
                    <span>Save to Vault</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>



  );        // ← Make sure this lines up with your initial `return (`
};          // ← Closes `const Portfolio = () => {`

export default Portfolio;
