import React, { useEffect, useState } from 'react';
import { User, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button'; 

const Header = () => {
    const [userName, setUserName] = useState('Guest');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);
            const authToken = localStorage.getItem('authToken'); 

            if (!authToken) {
                // No token found, user is not authenticated
                setUserName('Guest');
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                // Token found, attempt to fetch user profile
                const response = await fetch('http://localhost:5000/api/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (!response.ok) {
                    // Token might be expired or invalid
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch user profile.');
                }

                const userData = await response.json();
                setUserName(userData.username || 'User');
                setIsAuthenticated(true); // User is authenticated
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError(err.message);
                setUserName('Guest');
                setIsAuthenticated(false); // Not authenticated if fetch fails
                localStorage.removeItem('authToken'); // clearing invalid token
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false); 
        setUserName('Guest');
        window.location.href = '/login'; 
        console.log("User signed out.");
    };

    const handleLoginSignUp = () => {
        
        window.location.href = '/login';
        console.log("Navigating to login/signup.");
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-gray-900">TypeFlow-Finance</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {loading ? (
                            <span>Loading...</span>
                        ) : error ? (
                            <span className="text-red-500">Error: {error}</span>
                        ) : (
                            <span>Welcome, {userName}!</span>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Always show Search and Bell, if desired */}
                        <Button variant="ghost" size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Bell className="h-4 w-4" />
                        </Button>

                        {/* Conditional rendering for Login/Sign Up vs. Sign Out */}
                        {isAuthenticated ? (
                            <Button variant="outline" className="text-sm" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        ) : (
                            <Button variant="outline" className="text-sm" onClick={handleLoginSignUp}>
                                Login/Sign Up
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;