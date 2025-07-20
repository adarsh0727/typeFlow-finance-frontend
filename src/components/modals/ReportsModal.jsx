import React, { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { XCircle, Loader2 } from 'lucide-react';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#6a0572", "#a6e3e9", "#70d6ff", "#ff70a6", "#ff9770"];

const ReportsModal = ({ isOpen, onClose }) => {
  const [selectedGraphType, setSelectedGraphType] = useState("monthly-spending");
  const [graphData, setGraphData] = useState([]);
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);
  const [graphError, setGraphError] = useState(null);

  // Function to fetch data for the selected graph type
  const fetchGraphData = async (type) => {
    setIsLoadingGraph(true);
    setGraphError(null);
    setGraphData([]);

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Authentication token not found. Please log in.');
      }

      const apiUrl = `http://localhost:5000/api/reports/${type}`;

      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch ${type} data: ${response.status}`);
      }

      const json = await response.json();
      setGraphData(json);
    } catch (error) {
      console.error("Failed to fetch graph data:", error);
      setGraphError(error.message || "An error occurred while fetching graph data.");
    } finally {
      setIsLoadingGraph(false);
    }
  };

  useEffect(() => {
    if (isOpen) { // Conditional logic inside useEffect is fine
      fetchGraphData(selectedGraphType);
    }
  }, [isOpen, selectedGraphType]);

  const handleClose = () => {
    setSelectedGraphType("monthly-spending");
    setGraphData([]);
    setIsLoadingGraph(true);
    setGraphError(null);
    onClose();
  };

  if (!isOpen) return null;


  // Renders the appropriate chart based on selectedGraphType
  const renderChart = () => {
    if (isLoadingGraph) return <p className="text-center py-8"><Loader2 className="animate-spin inline-block mr-2" /> Loading chart...</p>;
    if (graphError) return <p className="text-center text-red-500 py-8">Error: {graphError}</p>;
    if (!graphData || graphData.length === 0) return <p className="text-center py-8">No data available for this report.</p>;

    switch (selectedGraphType) {
      case "monthly-spending":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graphData}>
              <XAxis dataKey="monthYear" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" name="Spending" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "expenses-by-category":
        const pieChartData = graphData.map(item => ({
          name: item.category,
          value: item.amount
        }));
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case "income-vs-expense":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <XAxis dataKey="monthYear" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#82ca9d" name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#8884d8" name="Expense" />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-white shadow-2xl border border-gray-100 rounded-xl relative flex flex-col max-h-[90vh]">
        <CardHeader className="flex flex-row items-center justify-between pb-4 sticky top-0 bg-white z-10 border-b border-gray-200 rounded-t-xl">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Financial Reports
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XCircle className="h-6 w-6" />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto p-6">
          <div className="flex justify-end mb-6">
            <Select value={selectedGraphType} onValueChange={setSelectedGraphType} disabled={isLoadingGraph}>
              <SelectTrigger className="w-[220px] bg-white border-gray-200 text-gray-900">
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="monthly-spending">Spending: Last 12 Months</SelectItem>
                <SelectItem value="expenses-by-category">Expense by Category</SelectItem>
                <SelectItem value="income-vs-expense">Income vs Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-gray-50/30 rounded-lg p-4 border border-gray-100">
            {renderChart()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsModal;