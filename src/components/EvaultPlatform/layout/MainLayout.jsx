import React from 'react';
import InfoColumn from './InfoColumn';
import ContentColumn from './ContentColumn';
import Footer from '../Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative pt-14">
      <div className="flex-grow flex flex-col lg:flex-row relative">
        <InfoColumn />
        <ContentColumn>{children}</ContentColumn>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;