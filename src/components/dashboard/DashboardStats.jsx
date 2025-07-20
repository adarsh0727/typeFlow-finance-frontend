import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, TrendingUp, AlertCircle, Wallet, CreditCard, PiggyBank, BarChart3 } from 'lucide-react';

const StatCard = ({ title, amount, color, percentageChange, suffix = '', icon: Icon, gradientFrom, gradientTo, subtitle, subtitleColor }) => (
  <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group">
    {/* Gradient background overlay */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-10 group-hover:opacity-15 transition-opacity duration-300`}></div>
    
    {/* Subtle pattern overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] [background-size:20px_20px] opacity-30"></div>
    
    <CardHeader className="pb-3 relative z-10">
      <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wider">
        {Icon && <Icon className="h-4 w-4 opacity-70" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className={`text-3xl font-bold mb-1 ${color} tracking-tight`}>
        {amount}{suffix}
      </div>
      {subtitle && (
        <div className={`text-lg font-semibold ${subtitleColor} mb-1`}>
          {subtitle}
        </div>
      )}
      {percentageChange !== undefined && !isNaN(percentageChange) && (
        <p className={`text-sm flex items-center font-medium ${
          percentageChange > 0 ? 'text-emerald-500' : (percentageChange < 0 ? 'text-rose-500' : 'text-slate-500')
        }`}>
          {percentageChange > 0 && <TrendingUp className="h-4 w-4 mr-1" />}
          {percentageChange < 0 && <span className="mr-1 transform rotate-180 inline-block">
            <TrendingUp className="h-4 w-4" />
          </span>}
          {percentageChange === 0 ? '0%' : `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`} from last month
        </p>
      )}
    </CardContent>
    
    {/* Subtle border glow */}
    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-20 group-hover:opacity-30 transition-opacity duration-300 -z-10 blur-xl`}></div>
  </Card>
);

const DashboardStats = ({ isLoading, dashboardSummary }) => {
  if (isLoading || !dashboardSummary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Enhanced loading state with gradients */}
        {[1,2,3,4].map((i) => (
          <div key={i} className="bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-600 h-32 rounded-xl animate-pulse shadow-lg">
            <div className="p-6">
              <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded mb-3 w-3/4"></div>
              <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
              <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
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
      amount: `₹${netIncomeLast30Days.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      color: netIncomeLast30Days >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
      icon: Wallet,
      gradientFrom: "from-emerald-500",
      gradientTo: "to-teal-600"
    },
    {
      title: "Total Expenses (Last 30 Days)",
      amount: `₹${totalExpenseLast30Days.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      color: "text-rose-600 dark:text-rose-400",
      icon: CreditCard,
      gradientFrom: "from-rose-500",
      gradientTo: "to-pink-600"
    },
    {
      title: "Total Balance (Overall)", 
      amount: `₹${totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      color: totalBalance >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-rose-600 dark:text-rose-400",
      icon: PiggyBank,
      gradientFrom: "from-indigo-500",
      gradientTo: "to-purple-600"
    },
    {
      title: "Transactions (Last 30 Days)", 
      amount: totalTransactionsLast30Days.toLocaleString('en-IN'), 
      color: "text-amber-600 dark:text-amber-400",
      icon: BarChart3,
      gradientFrom: "from-amber-500",
      gradientTo: "to-orange-600",
      subtitle: `${savingsRate.toFixed(1)}% Savings Rate`,
      subtitleColor: "text-emerald-600 dark:text-emerald-400"
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
          icon={stat.icon}
          gradientFrom={stat.gradientFrom}
          gradientTo={stat.gradientTo}
          subtitle={stat.subtitle}
          subtitleColor={stat.subtitleColor}
        />
      ))}
    </div>
  );
};

export default DashboardStats;