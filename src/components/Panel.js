import React from "react";

const Panel = ({ children, className = "" }) => {
  return (
    <div className={`w-full min-h-full flex-1 bg-gray-100 px-20 pt-8 ${className}`}>
      {children}
    </div>
  );
};

export default Panel; 