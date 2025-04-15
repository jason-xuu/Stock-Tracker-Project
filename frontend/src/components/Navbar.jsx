// src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <div className="w-full flex justify-center bg-base-100 py-6">
      <div className="flex items-center gap-3 text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">
        {/* Custom SVG Logo (slightly larger) */}
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="40"
          width="40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"></path>
        </svg>
        <span>Stock Tracker</span>
      </div>
    </div>
  );
};

export default Navbar;
