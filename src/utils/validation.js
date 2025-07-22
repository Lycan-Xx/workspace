
// Validation utilities for eVault forms

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10,11}$/;
  return phoneRegex.test(phone);
};

export const validateNIN = (nin) => {
  const ninRegex = /^\d{11}$/;
  return ninRegex.test(nin);
};

export const validateRCNumber = (rcNumber) => {
  // RC numbers can vary in format, basic validation for length
  return rcNumber && rcNumber.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateBusinessName = (businessName) => {
  return businessName && businessName.trim().length >= 2;
};

export const validateOTP = (otp) => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

// Comprehensive form validation
export const validateSignupForm = (userData, accountType) => {
  const errors = {};

  // Common validations
  if (!validateEmail(userData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validatePassword(userData.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (userData.password !== userData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (userData.phone && !validatePhone(userData.phone.replace(/^\+234/, ''))) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Account type specific validations
  if (accountType === 'Personal') {
    if (!validateName(userData.firstname)) {
      errors.firstname = 'First name is required';
    }
    if (!validateName(userData.lastname)) {
      errors.lastname = 'Last name is required';
    }
  } else if (accountType === 'Business') {
    if (!validateBusinessName(userData.businessName)) {
      errors.businessName = 'Business name is required';
    }
    if (!validateRCNumber(userData.rcNumber)) {
      errors.rcNumber = 'Please enter a valid RC number';
    }
    if (!validateNIN(userData.nin)) {
      errors.nin = 'Please enter a valid 11-digit NIN';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = (credentials) => {
  const errors = {};

  if (!validateEmail(credentials.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!credentials.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateForgotPasswordForm = (phone, newPassword, confirmPassword) => {
  const errors = {};

  if (!validatePhone(phone.replace(/^\+234/, ''))) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!validatePassword(newPassword)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (newPassword !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
