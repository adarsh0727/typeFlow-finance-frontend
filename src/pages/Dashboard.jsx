import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import DashboardStats from '../components/dashboard/DashboardStats';
import QuickActions from '../components/dashboard/QuickActions';
import GettingStarted from '../components/dashboard/GettingStarted';
import { RefreshCw, AlertCircle, Loader2 } from 'lucide-react'; 
import { useAuth0 } from '@auth0/auth0-react';

export const Dashboard = () => {
  const { isAuthenticated, user, getAccessTokenSilently, isLoading: auth0Loading, error: auth0Error } = useAuth0();

  const [isLoadingDashboardData, setIsLoadingDashboardData] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [backendUser, setBackendUser] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  // Specific error for dashboard data fetching
  const [dashboardError, setDashboardError] = useState(null);

  // Function to fetch all necessary dashboard data your backend
  const fetchData = useCallback(async () => {
    
    if (auth0Loading || !isAuthenticated) {
      setIsLoadingDashboardData(false); 
      if (!auth0Loading && !isAuthenticated) {
        setDashboardError('Authentication required to load dashboard data.');
      } else if (auth0Error) {
        setDashboardError(auth0Error.message);
      }
      return;
    }

    setIsLoadingDashboardData(true);
    setDashboardError(null);
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE, 
        },
      });

      const userRes = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` 
        }
      });
      if (!userRes.ok) {
        const errorData = await userRes.json();
        throw new Error(errorData.message || 'Failed to fetch user profile from backend.');
      }
      const userData = await userRes.json();
      setBackendUser(userData); 
      
      const summaryRes = await fetch('http://localhost:5000/api/reports/dashboard-summary', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` // Uses Auth0 access token
        }
      });
      if (!summaryRes.ok) {
        const errorData = await summaryRes.json();
        throw new Error(errorData.message || 'Failed to fetch dashboard summary.');
      }
      const summaryData = await summaryRes.json();
      setDashboardSummary(summaryData);

      setLastUpdated(new Date()); 
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setDashboardError(err.message || 'An unknown error occurred.'); 
      setBackendUser(null);
      setDashboardSummary(null);
    } finally {
      setIsLoadingDashboardData(false);
    }
  }, [isAuthenticated, auth0Loading, auth0Error, getAccessTokenSilently]);

  useEffect(() => {
   
    if (!auth0Loading) {
      fetchData();
    }
  }, [auth0Loading, fetchData]); 

  const handleRefresh = () => {
    fetchData(); 
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };


  if (auth0Loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="ml-3 text-lg text-gray-700">Authenticating with Auth0...</p>
      </div>
    );
  }

  if (auth0Error || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
        <p className="text-gray-600 text-center">
          You must be logged in to view the dashboard. Please{' '}
          <a href="/" className="text-blue-600 hover:underline">
            go back to the login page
          </a>.
        </p>
        {auth0Error && <p className="text-red-500 text-sm mt-4">Error: {auth0Error.message}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header /> {/* Header handles its own Auth0 state */}

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {backendUser ? `Welcome back, ${backendUser.username ? backendUser.username.split(' ')[0] : 'User'}!` : 'Financial Dashboard'}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <p>Monitor and manage your financial portfolio</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <span className="text-sm text-gray-500">
              Last updated: {formatTime(lastUpdated)}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isLoadingDashboardData}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                isLoadingDashboardData ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingDashboardData ? 'animate-spin' : ''}`} />
              {isLoadingDashboardData ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Loading State for Dashboard Data */}
        {isLoadingDashboardData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  Updating dashboard data...
                </h3>
                <p className="text-sm text-blue-600">
                  Please wait while we fetch the latest information.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Error Message for Dashboard Data */}
        {dashboardError && !isLoadingDashboardData && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                        <h3 className="text-sm font-medium text-red-800">
                            Error loading dashboard:
                        </h3>
                        <p className="text-sm text-red-600">
                            {dashboardError}
                        </p>
                    </div>
                </div>
            </div>
        )}


        {/* Stats Cards - Only render if not loading and no error */}
        {!isLoadingDashboardData && !dashboardError && (
            <section aria-label="Financial Statistics">
                <DashboardStats isLoading={isLoadingDashboardData} dashboardSummary={dashboardSummary} />
            </section>
        )}


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2" aria-label="Quick Actions">
            <QuickActions />
          </section>

          <section aria-label="Getting Started Guide">
            <GettingStarted />
          </section>
        </div>
      </main>
    </div>
  );
};