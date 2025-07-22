
// Validation utilities for forms

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return {
    isValid: password && password.length >= 6,
    errors: []
  };
};

export const validatePhone = (phone) => {
  // Remove spaces and special characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid length (varies by country)
  if (cleanPhone.length < 8 || cleanPhone.length > 15) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }
  
  return { isValid: true, message: '' };
};

export const validateNIN = (nin) => {
  // Nigerian NIN is 11 digits
  const cleanNIN = nin.replace(/\D/g, '');
  
  if (cleanNIN.length !== 11) {
    return { isValid: false, message: 'NIN must be 11 digits' };
  }
  
  return { isValid: true, message: '' };
};

export const validateRCNumber = (rcNumber) => {
  // Basic RC number validation
  if (!rcNumber || rcNumber.trim().length < 6) {
    return { isValid: false, message: 'Please enter a valid RC number' };
  }
  
  return { isValid: true, message: '' };
};

export const validateForm = (formData, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });
  
  // Special validations
  if (formData.email && !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  if (formData.phone) {
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.message;
    }
  }
  
  if (formData.nin) {
    const ninValidation = validateNIN(formData.nin);
    if (!ninValidation.isValid) {
      errors.nin = ninValidation.message;
    }
  }
  
  if (formData.rcNumber) {
    const rcValidation = validateRCNumber(formData.rcNumber);
    if (!rcValidation.isValid) {
      errors.rcNumber = rcValidation.message;
    }
  }
  
  return errors;
};
