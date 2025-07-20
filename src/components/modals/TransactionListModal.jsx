import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAuth0 } from '@auth0/auth0-react'; 

const TransactionListModal = ({ isOpen, onClose }) => {
  // Auth0 hooks
  const { getAccessTokenSilently, isAuthenticated, isLoading: auth0Loading } = useAuth0();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // For transaction fetching
  const [error, setError] = useState(null); // General error for transactions

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10); // items per page

  
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('_all');

  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const [categories, setCategories] = useState([]); 
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false); // Loading state for categories
  const [categoriesError, setCategoriesError] = useState(null); // Error for categories fetch


  // Effect to fetch categories for the filter dropdown
  useEffect(() => {
    const fetchCategoriesForFilter = async () => {
      setIsCategoriesLoading(true);
      setCategoriesError(null);
      setCategories([]); 

      // Only attempt to fetch if Auth0 is ready and authenticated
      if (auth0Loading || !isAuthenticated) {
        setCategoriesError('Authentication required to load categories.'); 
        setIsCategoriesLoading(false);
        return;
      }

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.VITE_AUTH0_AUDIENCE,
          },
        });

        const res = await fetch('http://localhost:5000/api/categories', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch categories for filter.');
        }
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories for filter:', err);
        setCategoriesError(err.message);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    if (isOpen) { 
      fetchCategoriesForFilter();
    }
  }, [isOpen, isAuthenticated, auth0Loading, getAccessTokenSilently]);


  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isOpen || !isAuthenticated || auth0Loading) {
        setIsLoading(false); 
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.VITE_AUTH0_AUDIENCE,
          },
        });

        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', limit.toString());
        if (filterType && filterType !== 'all') queryParams.append('type', filterType);
        if (filterCategory && filterCategory !== "_all") queryParams.append('categoryId', filterCategory);
        if (filterStartDate) queryParams.append('startDate', filterStartDate);
        if (filterEndDate) queryParams.append('endDate', filterEndDate);

        const url = `http://localhost:5000/api/transactions?${queryParams.toString()}`;

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch transactions.');
        }

        const data = await response.json();
        setTransactions(data.transactions);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err.message);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [isOpen, currentPage, limit, filterType, filterCategory, filterStartDate, filterEndDate, isAuthenticated, auth0Loading, getAccessTokenSilently]); // Added Auth0 dependencies

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleClose = () => {
    setTransactions([]);
    setCurrentPage(1);
    setTotalPages(1);
    setLimit(10); 
    setFilterType('all'); 
    setFilterCategory('_all'); // Resets filter category to "_all"
    setFilterStartDate('');
    setFilterEndDate('');
    setError(null);
    setCategoriesError(null); // Clear categories error
    setIsLoading(false);
    setIsCategoriesLoading(false); // Clear categories loading
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl bg-white shadow-2xl border border-gray-100 rounded-xl relative flex flex-col max-h-[90vh]">
        <CardHeader className="flex flex-row items-center justify-between pb-4 sticky top-0 bg-white z-10 border-b border-gray-200 rounded-t-xl">
          <CardTitle className="text-2xl font-bold text-gray-900">
            All Transactions
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XCircle className="h-6 w-6" />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Filter by Type */}
            <Select
              value={filterType}
              onValueChange={setFilterType}
              disabled={isLoading || auth0Loading || !isAuthenticated} // Disable if Auth0 not ready
            >
              <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                <SelectValue placeholder={auth0Loading ? "Authenticating..." : (!isAuthenticated ? "Login required" : "Filter by type")} />
              </SelectTrigger>
              <SelectContent className="z-[9999] bg-white border-gray-200">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter by Category */}
            <Select
              value={filterCategory}
              onValueChange={setFilterCategory}
              disabled={isLoading || isCategoriesLoading || categories.length === 0 || !!categoriesError || auth0Loading || !isAuthenticated}
            >
              <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                <SelectValue
                  placeholder={
                    auth0Loading ? "Authenticating..." :
                    !isAuthenticated ? "Login required" :
                    isCategoriesLoading ? "Loading categories..." :
                    categoriesError ? `Error: ${categoriesError}` :
                    "Filter by category"
                  }
                />
              </SelectTrigger>
              <SelectContent className="z-[9999] bg-white border-gray-200">
                <SelectItem value="_all">All Categories</SelectItem>
                {isAuthenticated && !isCategoriesLoading && !categoriesError && categories.map(cat => (
                  <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Filters */}
            <Input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              placeholder="Start Date"
              className="bg-white border-gray-200 text-gray-900"
              disabled={isLoading || auth0Loading || !isAuthenticated}
            />
            <Input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              placeholder="End Date"
              className="bg-white border-gray-200 text-gray-900"
              disabled={isLoading || auth0Loading || !isAuthenticated}
            />
          </div>


          {auth0Loading && (
            <div className="flex items-center justify-center py-8 text-blue-500">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <p>Authenticating...</p>
            </div>
          )}
          {!auth0Loading && !isAuthenticated && (
            <div className="flex items-center p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
              <XCircle className="h-5 w-5 mr-3" />
              <p>You must be logged in to view transactions.</p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-blue-500" />
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex items-center p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
              <XCircle className="h-5 w-5 mr-3" />
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && isAuthenticated && transactions.length === 0 && (
            <div className="text-center text-gray-600 py-8">
              <p>No transactions found for the selected criteria. Try adding some!</p>
            </div>
          )}

          {/* Transactions Table */}
          {!isLoading && !error && isAuthenticated && transactions.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date & Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Merchant</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Payment Method</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <TableRow key={transaction._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-900">
                        {transaction.category ? transaction.category.name : 'N/A'}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-900">
                        {transaction.merchantName || transaction.description || 'N/A'}
                      </TableCell>
                      <TableCell className={`px-4 py-3 text-right font-medium ${
                        transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'expense' ? '-' : '+'}
                        {transaction.amount.toFixed(2)} {transaction.currency}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-900">
                        {transaction.paymentMethod || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && !error && isAuthenticated && totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading}
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || isLoading}
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionListModal;