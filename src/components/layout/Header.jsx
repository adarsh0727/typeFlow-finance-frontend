import React from 'react';
import { User, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth0 } from '@auth0/auth0-react'; 

const Header = () => {
    const {
        isAuthenticated,       
        user,                  
        loginWithRedirect,     
        logout,                
        isLoading: auth0Loading 
    } = useAuth0();

    const userName = isAuthenticated && user
        ? user.name || user.nickname || user.email?.split('@')[0] || 'User'
        : 'Guest';

    const handleSignOut = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
        console.log("User signed out via Auth0.");
    };

    const handleLoginSignUp = () => {
        loginWithRedirect();
        console.log("Navigating to Auth0 login/signup.");
    };

    console.log(user.picture);

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-gray-900">TypeFlow-Finance</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {/* Shows loading state from Auth0 SDK */}
                        {auth0Loading ? (
                            <span>Loading user...</span>
                        ) : (
                            <span>Welcome, {userName}!</span>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        {!isAuthenticated && (
                            <Button variant="ghost" size="icon">
                                <Search className="h-4 w-4" />
                            </Button>
                        )}
                        
                        <Button variant="ghost" size="icon">
                            <Bell className="h-4 w-4" />
                        </Button>

                        {isAuthenticated && user && (
                        <Button variant="ghost" size="icon" className="rounded-full p-0 w-8 h-8">
                            {user.picture ? (
                            <img
                                src={user.picture}
                                alt={userName}
                                className="w-8 h-8 rounded-full object-cover"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;
                                }}
                            />
                            ) : (
                            <User className="h-4 w-4" />
                            )}
                        </Button>
                        )}


                        {isAuthenticated ? (
                            <Button variant="outline" className="text-sm" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        ) : (
                            <Button variant="outline" className="text-sm" onClick={handleLoginSignUp}>
                                Login / Sign Up
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;