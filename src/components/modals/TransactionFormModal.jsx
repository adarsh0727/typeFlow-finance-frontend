import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { XCircle, CheckCircle, Loader2, X } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react'; 

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TransactionFormModal = ({ isOpen, onClose, defaultType = 'expense' }) => {
  const { getAccessTokenSilently, isAuthenticated, isLoading: auth0Loading } = useAuth0();

  const [type, setType] = useState(defaultType);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [categoryId, setCategoryId] = useState(''); 
  const [paymentMethod, setPaymentMethod] = useState('');
  const [tags, setTags] = useState('');

  const [categories, setCategories] = useState([]);
  const [fetchingCategoriesError, setFetchingCategoriesError] = useState(null); 
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false); 
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
      setDescription('');
      setMerchantName('');
      setCategoryId(''); 
      setPaymentMethod('');
      setTags('');
      setMessage(''); 
      setIsError(false);
      setFetchingCategoriesError(null); 
      if (isAuthenticated && !auth0Loading) {
        fetchCategories();
      }
    }
  }, [isOpen, defaultType, isAuthenticated, auth0Loading]); 
  

  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    setFetchingCategoriesError(null);
    setCategories([]);
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.VITE_AUTH0_AUDIENCE, 
        },
      });

      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch categories.');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setFetchingCategoriesError(error.message);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.type === 'both' || cat.type === type
  );

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    if (!isAuthenticated || auth0Loading) {
      setMessage('Authentication required. Please log in.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (!type || !amount || !date || !categoryId) {
      setMessage('Please fill in all required fields: Type, Amount, Date, Category.');
      setIsError(true);
      setIsLoading(false);
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setMessage('Amount must be a positive number.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const transactionData = {
      type,
      amount: parseFloat(amount),
      date,
      description: description.trim(),
      merchantName: merchantName.trim(),
      categoryId,
      paymentMethod: paymentMethod.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    };

    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.VITE_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add transaction.');
      }

      setMessage('Transaction added successfully! 🎉');
      setIsError(false);
      setType(defaultType);
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setMerchantName('');
      setCategoryId('');
      setPaymentMethod('');
      setTags('');

      setTimeout(onClose, 1500);
    } catch (error) {
      console.error('Error adding transaction:', error);
      setMessage(error.message || 'An unexpected error occurred.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg">
        <Card className="bg-white shadow-2xl border-0 rounded-xl flex flex-col max-h-[95vh]"> {/* Added flex-col and max-h */}
          <CardHeader className="pb-4 sticky top-0 bg-white z-10 border-b border-gray-200 rounded-t-xl"> {/* Sticky header */}
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {type === 'expense' ? 'Add New Expense' : 'Add New Income'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-0 flex-grow overflow-y-auto"> {/* Added flex-grow and overflow-y-auto */}
            <form onSubmit={handleSubmit} className="space-y-5 py-4"> {/* Added padding to form */}
              {/* Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Transaction Type *
                </Label>
                <Select value={type} onValueChange={setType} disabled={isLoading || auth0Loading}>
                  <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]"> {/* Ensure high z-index for dropdown content */}
                    <SelectItem value="expense">💸 Expense</SelectItem>
                    <SelectItem value="income">💰 Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amount and Date Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                    Amount *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    disabled={isLoading}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category *
                </Label>
                <Select
                  value={categoryId}
                  onValueChange={setCategoryId}
                  disabled={isLoading || isCategoriesLoading || fetchingCategoriesError || !isAuthenticated}
                >
                  <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue
                      placeholder={
                        auth0Loading ? "Authenticating..." : // Auth0 SDK loading
                        !isAuthenticated ? "Login required" : // Not authenticated
                        isCategoriesLoading ? "Loading categories..." : // Categories still fetching
                        fetchingCategoriesError ? `Error: ${fetchingCategoriesError}` : // Error fetching categories
                        filteredCategories.length === 0 ? "No categories found." : // No categories for type
                        "Select category" // Default placeholder
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]"> {/* Ensure high z-index */}
                    {/* Render categories only if authenticated, not loading, no error, and categories exist */}
                    {isAuthenticated && !isCategoriesLoading && !fetchingCategoriesError && filteredCategories.length > 0 &&
                      filteredCategories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    }
                    {/* No direct <SelectItem> for "No categories found" to avoid Radix UI error.
                        The placeholder will handle this state. */}
                  </SelectContent>
                </Select>
              </div>

              {/* Merchant Name */}
              <div className="space-y-2">
                <Label htmlFor="merchantName" className="text-sm font-medium text-gray-700">
                  Merchant Name
                </Label>
                <Input
                  id="merchantName"
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="e.g., Starbucks, Amazon"
                  disabled={isLoading}
                  className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any notes about this transaction..."
                  rows={3}
                  disabled={isLoading}
                  className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Payment Method and Tags Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">
                    Payment Method
                  </Label>
                  <Input
                    id="paymentMethod"
                    type="text"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    placeholder="Credit Card, Cash"
                    disabled={isLoading}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="food, work, travel"
                    disabled={isLoading}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Message/Error Display */}
              {message && (
                <div className={`flex items-start p-4 rounded-lg border ${
                  isError
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-green-50 border-green-200 text-green-700'
                }`}>
                  {isError ? <XCircle className="h-5 w-5 mr-3 flex-shrink-0" /> : <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />}
                  <span className="text-sm font-medium">{message}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  disabled={isLoading || !isAuthenticated || auth0Loading} // Disable if not authenticated or loading
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Adding Transaction...
                    </>
                  ) : (
                    <>
                      {type === 'expense' ? '💸' : '💰'} Add {type === 'expense' ? 'Expense' : 'Income'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionFormModal;