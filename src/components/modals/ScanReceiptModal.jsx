import React, { useState } from 'react'; 
import { Button } from '@/components/ui/button';
import { Upload, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const ScanReceiptModal = ({ isOpen, onClose }) => {
  const { getAccessTokenSilently, isAuthenticated, isLoading: auth0Loading } = useAuth0();

  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
    setIsError(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      setIsError(true);
      return;
    }

    if (auth0Loading || !isAuthenticated) {
        setMessage('Authentication required. Please log in to upload receipts.');
        setIsError(true);
        return;
    }

    setIsLoading(true); 
    setMessage('');
    setIsError(false);

    const formData = new FormData();
    formData.append('receipt', selectedFile); 

    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch('http://localhost:5000/api/ocr/upload-receipt', {
        method: 'POST',
        headers: {
          
          'Authorization': `Bearer ${accessToken}` // Using the Auth0 access token
        },
        body: formData,
      });

      console.log(accessToken);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to process receipt.');
      }

      setMessage('Receipt processed and transaction created successfully!');
      setIsError(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error.message || 'An unexpected error occurred during upload.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setIsLoading(false);
    setMessage('');
    setIsError(false);
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-8 w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <XCircle className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan Receipt</h2>
        <p className="text-gray-600 mb-8">Upload an image or PDF of your receipt to automatically extract transaction details.</p>

        <div className="mb-6">
          <label
            htmlFor="receipt-upload"
            className="flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors group"
          >
            <Upload className="h-8 w-8 mb-3 text-gray-400 group-hover:text-gray-500 transition-colors" />
            <span className="text-gray-700 font-medium text-center">
              {selectedFile ? selectedFile.name : 'Choose Image or PDF'}
            </span>
            <span className="text-sm text-gray-500 mt-1">
              {selectedFile ? 'File selected' : 'Click to browse files'}
            </span>
            <input
              id="receipt-upload"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading || auth0Loading} 
            />
          </label>
        </div>

        {/* Display Auth0 loading/error or general upload message */}
        {(auth0Loading || !isAuthenticated) && !isLoading && (
            <div className={`flex items-start p-4 rounded-lg mb-6 text-sm ${!isAuthenticated ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                {auth0Loading ? <Loader2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 animate-spin" /> : <XCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />}
                <span>{auth0Loading ? "Authenticating..." : "You must be logged in to upload receipts."}</span>
            </div>
        )}

        {message && (
          <div className={`flex items-start p-4 rounded-lg mb-6 text-sm ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {isError ? <XCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" /> : <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />}
            <span>{message}</span>
          </div>
        )}

        <Button
          onClick={handleUpload}
          className="w-full py-3 text-base font-medium"
          disabled={isLoading || !selectedFile || auth0Loading || !isAuthenticated} // Disable if Auth0 not ready or not authenticated
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Upload and Process'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ScanReceiptModal;