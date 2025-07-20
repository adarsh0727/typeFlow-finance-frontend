import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle } from 'lucide-react';

const GettingStarted = () => {
  const steps = [
    { text: "Add your first income or expense transaction", completed: false },
    { text: "Set up your financial categories", completed: false },
    { text: "Upload a receipt using OCR", completed: false },
    { text: "View your first financial report", completed: false }
  ];

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <span className="text-green-600">🚀</span>
          <span>Getting Started</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Complete these steps to get the most out of your Personal Finance Assistant:
        </p>
        
        <div className="space-y-3 mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              {step.completed ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Circle className="h-4 w-4 text-gray-300" />
              )}
              <span className={`text-sm ${step.completed ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                {step.text}
              </span>
            </div>
          ))}
        </div>
        
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          Start Your Journey
        </Button>
      </CardContent>
    </Card>
  );
};

export default GettingStarted;
