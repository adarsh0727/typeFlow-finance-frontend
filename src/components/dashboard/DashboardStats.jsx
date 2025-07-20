import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatCard = ({ title, amount, color }) => (
  <Card className="bg-white">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>
        {amount}
      </div>
    </CardContent>
  </Card>
);

const DashboardStats = () => {
  const stats = [
    { title: "Net Income", amount: "$0.00", color: "text-green-600" },
    { title: "Total Expenses", amount: "$0.00", color: "text-red-600" },
    { title: "Net Balance", amount: "$0.00", color: "text-gray-900" },
    { title: "Transactions", amount: "0", color: "text-blue-600" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          amount={stat.amount}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default DashboardStats;