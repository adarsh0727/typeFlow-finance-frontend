import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, TrendingUp, AlertCircle } from 'lucide-react'; // Import AlertCircle for error display

const StatCard = ({ title, amount, color, percentageChange, suffix = '' }) => (
  <Card className="bg-white dark:bg-zinc-800 shadow-md">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-zinc-300">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>
        {amount}{suffix}
      </div>
      {percentageChange !== undefined && !isNaN(percentageChange) && (
        <p className={`text-sm mt-1 flex items-center ${
          percentageChange > 0 ? 'text-green-500' : (percentageChange < 0 ? 'text-red-500' : 'text-gray-500')
        }`}>
          {percentageChange > 0 && <TrendingUp className="h-4 w-4 mr-1" />}
          {percentageChange < 0 && <span className="mr-1 transform rotate-180 inline-block">
            <TrendingUp className="h-4 w-4" />
          </span>}
          {percentageChange === 0 ? '0%' : `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`} from last month
        </p>
      )}
    </CardContent>
  </Card>
);

const DashboardStats = ({ isLoading, dashboardSummary }) => {
  if (isLoading || !dashboardSummary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {/* Placeholder cards for loading state */}
        <div className="bg-gray-200 dark:bg-zinc-700 h-28 rounded-lg"></div>
        <div className="bg-gray-200 dark:bg-zinc-700 h-28 rounded-lg"></div>
        <div className="bg-gray-200 dark:bg-zinc-700 h-28 rounded-lg"></div>
        <div className="bg-gray-200 dark:bg-zinc-700 h-28 rounded-lg"></div>
      </div>
    );
  }

  const {
    totalBalance = 0,
    monthlyIncome = 0,
    monthlyExpenses = 0,
    incomeChange = 0,
    expenseChange = 0,
    savingsRate = 0,
    netIncomeLast30Days = 0, 
    totalExpenseLast30Days = 0,
    totalTransactionsLast30Days = 0
  } = dashboardSummary;

  const stats = [
    {
      title: "Net Income (Last 30 Days)", 
      amount: `Rs. ${netIncomeLast30Days.toFixed(2)}`,
      color: netIncomeLast30Days >= 0 ? "text-green-600" : "text-red-600"
    },
    {
      title: "Total Expenses (Last 30 Days)",
      amount: `Rs. ${totalExpenseLast30Days.toFixed(2)}`,
      color: "text-red-600"
    },
    {
      title: "Total Balance (Overall)", 
      amount: `Rs. ${totalBalance.toFixed(2)}`,
      color: totalBalance >= 0 ? "text-green-600" : "text-red-600"
    },
    {
      title: "Transactions (Last 30 Days)", 
      amount: totalTransactionsLast30Days.toLocaleString(), 
      color: "text-blue-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          amount={stat.amount}
          color={stat.color}
          percentageChange={stat.percentageChange}
          suffix={stat.suffix}
        />
      ))}
    </div>
  );
};

export default DashboardStats;