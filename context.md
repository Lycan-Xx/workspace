# eVault Frontend Context & Architecture Guide

## 1. Project Overview

eVault is a modern financial platform designed to provide users with secure account onboarding, multi-tiered account types, balance management, instant payments, and utility services (airtime, data, TV, electricity, school fees, etc.). The frontend is built with React and leverages modular components for scalability and maintainability. The EvaultPlatform directory contains the core business logic and user flows for authenticated users.

---

## 2. Directory Structure

```
evault-frontend/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── index.js
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── LandingPage/
│   │   │   ├── About.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Mission.jsx
│   │   │   ├── MobileApp.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Offer.jsx
│   │   │   └── Services.jsx
│   │   ├── EvaultPlatform/
│   │   │   ├── PlatformApp.jsx
│   │   │   ├── PlatfromRoute.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ServiceCard.jsx
│   │   │   ├── Slider.jsx
│   │   │   ├── account-upgrades/
│   │   │   │   ├── business-upgrade/
│   │   │   │   ├── shared/
│   │   │   │   ├── tier2/
│   │   │   │   └── tier3/
│   │   │   ├── authentication/
│   │   │   │   └── security/
│   │   │   ├── common/
│   │   │   │   └── PinVerificationModal.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── PaymentCard.jsx
│   │   │   │   ├── Portal.jsx
│   │   │   │   ├── ServiceCardsDescription.jsx
│   │   │   │   ├── SettingsApp.jsx
│   │   │   │   ├── SideBar.jsx
│   │   │   │   ├── TopBar.jsx
│   │   │   │   ├── Trade.jsx
│   │   │   │   ├── VirtualCardRequest.jsx
│   │   │   │   ├── layout/
│   │   │   │   ├── Portfolio/
│   │   │   │   ├── Services/
│   │   │   │   ├── settings/
│   │   │   │   ├── TabContents/
│   │   │   │   └── Vault/
│   │   │   ├── InstantPayments/
│   │   │   │   ├── CategoryGrid.jsx
│   │   │   │   ├── InstantPayments.jsx
│   │   │   │   ├── VendorDetails.jsx
│   │   │   │   └── VendorList/
│   │   │   ├── layout/
│   │   │   │   ├── ContentColumn.jsx
│   │   │   │   ├── InfoColumn.jsx
│   │   │   │   └── MainLayout.jsx
│   │   │   ├── security/
│   │   │   │   └── ConfigureSecurity.jsx
│   │   │   ├── signin/
│   │   │   │   └── SignIn.jsx
│   │   │   ├── signup/
│   │   │   │   └── SignUp.jsx
│   │   │   ├── store/
│   │   │   │   ├── authSlice.js
│   │   │   │   └── store.js
│   │   └── assets/
│   │       ├── ...images
│   │       └── ...logos
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

---

## 3. EvaultPlatform Component Breakdown

### 3.1 PlatformApp.jsx
- **Main entry for authenticated user flows.**
- Handles view transitions (instant payments, dashboard, onboarding, etc.)
- Uses animated transitions for smooth navigation.
- Manages selected vendor and current view state.

### 3.2 PlatfromRoute.jsx
- **Route protection logic.**
- PrivateRoute, SecurityRoute, PublicRoute components for access control.
- Integrates with Redux store for authentication state.

### 3.3 Account Onboarding & Upgrades
- **account-upgrades/**: Business, shared, tier2, tier3 onboarding flows.
- KYC verification, document upload, and tier upgrades.

### 3.4 Dashboard & Financial Operations
- **Dashboard/**: User dashboard, payment cards, portfolio, vault, settings, sidebar, topbar, trade, virtual card request.
- **Services/**: Service cards and descriptions for all available financial and utility services.

### 3.5 Instant Payments
- **InstantPayments/**: Category grid, vendor list, vendor details, instant payment flows.
- Handles airtime, data, TV, electricity, and other bill payments.

### 3.6 Security & Authentication
- **authentication/security/**: Security configuration, PIN verification modal, sign-in and sign-up flows.

### 3.7 Layout & Common Components
- **layout/**: MainLayout, ContentColumn, InfoColumn for consistent UI structure.
- **common/**: Shared modals and utilities.

---

## 4. Modular Service Diagram

```plaintext
+-------------------+      +-------------------+      +-------------------+
|   Onboarding      | ---> |   Dashboard       | ---> |   Payments        |
+-------------------+      +-------------------+      +-------------------+
        |                        |                        |
        v                        v                        v
+-------------------+      +-------------------+      +-------------------+
|   Account Types   |      |   Portfolio       |      |   Utility Bills   |
+-------------------+      +-------------------+      +-------------------+
        |                        |                        |
        v                        v                        v
+-------------------+      +-------------------+      +-------------------+
|   Security        |      |   Virtual Cards   |      |   Vendor List     |
+-------------------+      +-------------------+      +-------------------+
```

---

## 5. Key Frontend Flows

- **User Onboarding:**
  - Multi-step forms for personal/business accounts
  - KYC document upload and verification
  - Tier upgrades and account type selection

- **Authentication:**
  - Sign-in, sign-up, PIN verification, and security configuration
  - Protected routes for sensitive operations

- **Dashboard:**
  - Overview of balances, cards, transactions, and portfolio
  - Quick access to payments and services

- **Instant Payments:**
  - Select category (airtime, data, TV, electricity, school fees)
  - Choose vendor, enter details, confirm and pay

- **Service Cards:**
  - Display all available services with icons and descriptions
  - Interactive cards for navigation

- **Virtual Cards:**
  - Request, view, and manage virtual cards for online transactions

- **Security:**
  - Configure security settings, PIN, and 2FA

---

## 6. Technologies Used

- **React** (functional components, hooks)
- **Redux** (authentication state, global store)
- **Framer Motion** (animations, transitions)
- **Tailwind CSS** (utility-first styling)
- **Vite** (fast build tool)
- **React Icons** (iconography)

---

## 7. Integration Points for Backend

- **Authentication:**
  - Register, login, session, and token management
- **Account Management:**
  - Onboarding, KYC, tier upgrades, account info
- **Payments:**
  - Airtime, data, TV, electricity, school fees, virtual cards
- **Dashboard:**
  - Balances, transaction history, portfolio
- **Security:**
  - PIN, 2FA, password management
- **Vendor & Utility Services:**
  - Fetch vendor lists, process payments, confirm transactions

---

## 8. Recommendations for Backend Team

- **Design RESTful APIs** for each modular service (auth, accounts, payments, utilities, notifications)
- **Implement role-based access control** for different account types and tiers
- **Support real-time updates** for payments and notifications (WebSocket/Socket.io)
- **Ensure secure data handling** (encryption, validation, error handling)
- **Provide comprehensive API documentation** (Swagger/OpenAPI)
- **Plan for scalability and modularity** to support future features

---

## 9. Summary

This frontend setup is modular, scalable, and designed for rapid development and easy maintenance. The EvaultPlatform components encapsulate all core business logic and user flows, making it straightforward for backend engineers to map frontend requirements to backend services. The directory structure and modular diagram provide a clear overview for onboarding new team members and planning backend integrations.

---

## 10. Visual Reference

![Evault Platform Modular Diagram](https://dummyimage.com/800x400/025798/fff&text=Evault+Platform+Modular+Services)

---

For further details, refer to the individual component files and flows in the `src/components/EvaultPlatform/` directory.
