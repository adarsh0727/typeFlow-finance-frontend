import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "@/pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="*"
          element={
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold">
                404 - Not Found
              </h2>
              <p>
                <a href="/" className="text-blue-600">Go Home</a>
              </p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;