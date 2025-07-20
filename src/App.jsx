import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "@/pages/Dashboard";
import LandingPage from "@/pages/LandingPage";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Loader2 } from "lucide-react"; // <-- Add this import

// A wrapper component to protect routes
const ProtectedRoute = ({ component: Component, ...args }) => {
  const { isLoading } = useAuth0();

  // Show a loading screen while Auth0 is authenticating
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="ml-3 text-lg text-gray-700">Loading authentication...</p>
      </div>
    );
  }

  // Use withAuthenticationRequired from Auth0 SDK to enforce login
  const ComponentWithAuth = withAuthenticationRequired(Component, {
    onRedirecting: () => (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="ml-3 text-lg text-gray-700">Redirecting to login...</p>
      </div>
    ),
  });
  return <ComponentWithAuth {...args} />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page - accessible to everyone */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard - protected route, requires authentication */}
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />

        {/* Catch-all for 404 Not Found */}
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