import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PlatformApp from './PlatformApp';
import Dashboard from './Dashboard/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlatformApp initialView="platform-app" />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/sign-in" element={<PlatformApp initialView="sign-in" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;