import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';


const TransactionListModal = ({ isOpen, onClose }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10); // items per page

  // Filtering states
  const [filterType, setFilterType] = useState('all'); // 'income', 'expense', or 'all' for all types
  const [filterCategory, setFilterCategory] = useState('_all'); // Selected category ID, use "_all" for no filter
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const [categories, setCategories] = useState([]); // To populate category filter dropdown

  useEffect(() => {
    const fetchCategoriesForFilter = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) throw new Error('Auth token missing for categories.');
        const res = await fetch('http://localhost:5000/api/categories', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch categories for filter.');
        }
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories for filter:', err);
        setError(err.message);
      }
    };
    if (isOpen) {
      fetchCategoriesForFilter();
    }
  }, [isOpen]);


  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      setError(null);
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('Authentication token not found. Please log in.');
        }

        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', limit.toString());
        // Only add type filter if it's not 'all'
        if (filterType && filterType !== 'all') queryParams.append('type', filterType);
        if (filterCategory && filterCategory !== "_all") queryParams.append('categoryId', filterCategory);
        if (filterStartDate) queryParams.append('startDate', filterStartDate);
        if (filterEndDate) queryParams.append('endDate', filterEndDate);

        const url = `http://localhost:5000/api/transactions?${queryParams.toString()}`;

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
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
  }, [isOpen, currentPage, limit, filterType, filterCategory, filterStartDate, filterEndDate]); // Re-fetch on filter/pagination change

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleClose = () => {
    setTransactions([]);
    setCurrentPage(1);
    setTotalPages(1);
    setLimit(10); // Resets limit to default
    setFilterType('all'); // Resets to 'all' instead of empty string
    setFilterCategory('_all'); // Resets filter category to "_all"
    setFilterStartDate('');
    setFilterEndDate('');
    setError(null);
    setIsLoading(false);
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
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="z-[9999] bg-white border-gray-200">
                {/* Changed from empty string to 'all' */}
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter by Category */}
            <Select value={filterCategory} onValueChange={setFilterCategory} disabled={categories.length === 0 || !!error}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                <SelectValue placeholder={error ? `Error: ${error}` : "Filter by category"} />
              </SelectTrigger>
              <SelectContent className="z-[9999] bg-white border-gray-200">
                {/* This is fine as "_all" is not an empty string */}
                <SelectItem value="_all">All Categories</SelectItem>
                {/* Map over fetched categories */}
                {categories.map(cat => (
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
            />
            <Input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              placeholder="End Date"
              className="bg-white border-gray-200 text-gray-900"
            />
          </div>


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

          {!isLoading && !error && transactions.length === 0 && (
            <div className="text-center text-gray-600 py-8">
              <p>No transactions found for the selected criteria.</p>
            </div>
          )}

          {!isLoading && !error && transactions.length > 0 && (
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
                    <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.category ? transaction.category.name : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.merchantName || transaction.description || 'N/A'}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${
                        transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'expense' ? '-' : '+'}
                        {transaction.amount.toFixed(2)} {transaction.currency}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.paymentMethod || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && !error && totalPages > 1 && (
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