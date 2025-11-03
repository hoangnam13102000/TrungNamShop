// NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <h1 className="text-9xl font-extrabold text-gray-400 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">Oops! Page not found</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Back Home
      </Link>
      <img
        src="https://undraw.co/api/illustrations/undraw_page_not_found_su7k.svg"
        alt="404 Illustration"
        className="mt-6 w-full max-w-sm md:max-w-md"
      />
    </div>
  );
};

export default NotFound;
