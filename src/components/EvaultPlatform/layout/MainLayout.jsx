import React from "react";
import InfoColumn from "./InfoColumn";
import ContentColumn from "./ContentColumn";
import Footer from "../Footer";

const MainLayout = ({ children, isAuthView = false }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative pt-14">
      <div className="flex-grow flex flex-col lg:flex-row relative">
        <div
          className={`${isAuthView ? "hidden lg:block" : "block"} w-full lg:w-[40%] xl:w-[35%]`}
        >
          <InfoColumn />
        </div>
        <div
          className={`flex-1 min-h-screen bg-gray-50 overflow-hidden ${isAuthView ? "w-full lg:w-[60%] xl:w-[65%]" : "w-full lg:w-[60%] xl:w-[65%]"}`}
        >
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
