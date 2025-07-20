// frontend/src/components/dashboard/QuickActions.jsx (Modified)
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, BarChart3, Receipt, FileText, TrendingUp, ListChecks } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScanReceiptModal from '../modals/ScanReceiptModal';
import TransactionFormModal from '../modals/TransactionFormModal';
import TransactionListModal from '../modals/TransactionListModal';
import ReportsModal from '../modals/ReportsModal'; 

const QuickActions = () => {
  const navigate = useNavigate();
  const [isScanReceiptModalOpen, setIsScanReceiptModalOpen] = useState(false);
  const [isTransactionFormModalOpen, setIsTransactionFormModalOpen] = useState(false);
  const [transactionFormDefaultType, setTransactionFormDefaultType] = useState('expense');
  const [isTransactionListModalOpen, setIsTransactionListModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false); // New state for ReportsModal

  const handleActionClick = (path, type = 'expense') => {
    if (path === "/scan-receipt") {
      setIsScanReceiptModalOpen(true);
    } else if (path === "/add-transaction") {
      setTransactionFormDefaultType(type);
      setIsTransactionFormModalOpen(true);
    } else if (path === "/view-transactions") {
      setIsTransactionListModalOpen(true);
    } else if (path === "/reports") { 
      setIsReportsModalOpen(true);
    }
    else {
      navigate(path);
    }
  };

  const actions = [
    {
      icon: <Plus className="h-4 w-4" />,
      title: "Add Expense",
      description: "Record a new expense transaction",
      color: "bg-red-50 hover:bg-red-100 border-red-200",
      path: "/add-transaction",
      type: "expense"
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      title: "Add Income",
      description: "Record a new income source",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      path: "/add-transaction",
      type: "income"
    },
    {
      icon: <ListChecks className="h-4 w-4" />,
      title: "View Transactions",
      description: "See all your past transactions in a list",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      path: "/view-transactions"
    }
  ];

  const additionalActions = [
    {
      icon: <Receipt className="h-4 w-4" />,
      title: "Scan Receipt (OCR)",
      description: "Upload and extract data from receipts",
      path: "/scan-receipt"
    },
    {
      icon: <FileText className="h-4 w-4" />,
      title: "Manual Entry",
      description: "Add transactions manually",
      path: "/add-transaction",
      type: "expense"
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: "View Reports",
      description: "Generate financial reports",
      path: "/reports" // This path will now open the ReportsModal
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Quick Actions */}
        {actions.map((action, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-colors ${action.color}`}
            onClick={() => handleActionClick(action.path, action.type)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-base">
                {action.icon}
                <span>{action.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{action.description}</p>
              <Button size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); handleActionClick(action.path, action.type); }}>
                {action.title}
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Additional Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">More Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {additionalActions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleActionClick(action.path, action.type)}
                >
                  <div className="text-gray-500">{action.icon}</div>
                  <div>
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ScanReceiptModal
        isOpen={isScanReceiptModalOpen}
        onClose={() => setIsScanReceiptModalOpen(false)}
      />
      <TransactionFormModal
        isOpen={isTransactionFormModalOpen}
        onClose={() => setIsTransactionFormModalOpen(false)}
        defaultType={transactionFormDefaultType}
      />
      <TransactionListModal
        isOpen={isTransactionListModalOpen}
        onClose={() => setIsTransactionListModalOpen(false)}
      />
      <ReportsModal 
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
      />
    </>
  );
};

export default QuickActions;