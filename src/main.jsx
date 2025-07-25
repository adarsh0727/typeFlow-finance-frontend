// frontend/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Auth0Provider } from "@auth0/auth0-react"; 


const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN ;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID ;
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE ;



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin + "/dashboard", // after login 
        audience: auth0Audience, // for getting acces token
        scope: "openid profile email", 
      }}
      useRefreshTokens={true} 
      cacheLocation="localstorage" 
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
);