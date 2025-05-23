import React from "react";
import BG_IMG from "../../images/protection.png";

function AuthLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Panel */}
      <div className="w-full md:w-[60%] px-6 md:px-12 pt-6 md:pt-12 pb-10">
        <h2 className="text-xl md:text-2xl font-semibold text-black mb-4">
          Task Manager
        </h2>
        {children}
      </div>

      {/* Right Panel (image) */}
      <div className="hidden md:flex w-[40%] h-screen items-center justify-center bg-blue-50 bg-cover bg-no-repeat bg-center p-8">
        <img className="w-64 lg:w-[90%]" src={BG_IMG} alt="Task Visual" />
      </div>
    </div>
  );
}

export default AuthLayout;
