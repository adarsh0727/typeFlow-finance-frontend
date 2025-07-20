import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header'; 
import DashboardStats from '../components/dashboard/DashboardStats'; 
import QuickActions from '../components/dashboard/QuickActions';
import GettingStarted from '../components/dashboard/GettingStarted';
import { RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';

export const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true); 
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [user, setUser] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
    //  auth token currently from local storage
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setError('Authentication token not found. Please log in.');
        setIsLoading(false);
        return;
      }

      
      const userRes = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!userRes.ok) {
        const errorData = await userRes.json();
        throw new Error(errorData.message || 'Failed to fetch user profile.');
      }
      const userData = await userRes.json();
      setUser(userData);

      
      const summaryRes = await fetch('http://localhost:5000/api/reports/dashboard-summary', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
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
      setError(err.message);
      setUser(null);
      setDashboardSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, []); 


  useEffect(() => {
    fetchData(); 
  }, [fetchData]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header /> 

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Page Header with Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user ? `Welcome back, ${user.username ? user.username.split(' ')[0] : 'User'}!` : 'Financial Dashboard'}
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
              disabled={isLoading}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Loading State or Error Message */}
        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin mr-3" />
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
        {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                        <h3 className="text-sm font-medium text-red-800">
                            Error loading dashboard:
                        </h3>
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        )}


        {/* Stats Cards - Passes dashboardSummary and loading state */}
        <section aria-label="Financial Statistics">
          <DashboardStats isLoading={isLoading} dashboardSummary={dashboardSummary} />
        </section>

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