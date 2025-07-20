import React, { useState, useEffect } from 'react';
import { TrendingUp, Receipt, PieChart, FileText, Users, Filter, Upload, BarChart3, DollarSign, Calendar, Shield, ArrowRight, Star } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';


const LandingPage = () => {

  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

    //   for auth0
    const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Income & Expense Tracking",
      description: "Easily log and categorize all your financial transactions with our intuitive interface."
    },
    {
      icon: <Receipt className="w-6 h-6" />,
      title: "Smart Receipt Processing",
      description: "Upload receipt images or PDFs and automatically extract expense data using AI technology."
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Visual Analytics",
      description: "View beautiful charts showing expenses by category, spending trends over time, and more."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "PDF Statement Import",
      description: "Import transaction history from bank statements in PDF format for comprehensive tracking."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-User Support",
      description: "Share financial management with family members or manage multiple accounts seamlessly."
    },
    {
      icon: <Filter className="w-6 h-6" />,
      title: "Advanced Filtering",
      description: "Filter transactions by date range, category, amount, and more with pagination support."
    }
  ];

  const stats = [
    { number: "100K+", label: "Transactions Processed" },
    { number: "99.9%", label: "Uptime Guaranteed" },
    { number: "24/7", label: "Support Available" },
    { number: "Bank-Level", label: "Security Standards" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-teal-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
                TypeFlow-Finance
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-teal-400 transition-colors">Features</a>
              <a href="#about" className="text-slate-300 hover:text-teal-400 transition-colors">About</a>
              <a href="#contact" className="text-slate-300 hover:text-teal-400 transition-colors">Contact</a>
              <button className="bg-gradient-to-r from-teal-500 to-sky-500 px-6 py-2 rounded-full hover:from-teal-600 hover:to-sky-600 transition-all transform hover:scale-105"
                onClick={() => loginWithRedirect()}
              >
                Login/SignUp
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-sky-400 via-teal-400 to-sky-300 bg-clip-text text-transparent">
              Master Your Finances
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The ultimate personal finance assistant that transforms how you track, analyze, and understand your money
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-teal-500 to-sky-500 px-8 py-4 rounded-full text-lg font-semibold hover:from-teal-600 hover:to-sky-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-teal-500/25">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
              <button className="border-2 border-teal-400 px-8 py-4 rounded-full text-lg font-semibold text-teal-400 hover:bg-teal-400 hover:text-slate-900 transition-all transform hover:scale-105">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">{stat.number}</div>
                <div className="text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to take control of your financial life in one comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-teal-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/10 ${
                  activeFeature === index ? 'border-teal-400 shadow-lg shadow-teal-500/20' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-teal-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-sky-300">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
                Smart Receipt Processing
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Simply upload a photo or PDF of your receipt, and our AI-powered system will automatically extract and categorize your expenses.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span className="text-slate-300">Supports images and PDF receipts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span className="text-slate-300">Automatic expense categorization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span className="text-slate-300">Bulk PDF transaction import</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-8 rounded-2xl border border-slate-600">
              <div className="flex items-center justify-center h-64 text-slate-400">
                <div className="text-center">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-teal-400" />
                  <p className="text-lg">Receipt Processing Demo</p>
                  <p className="text-sm mt-2">Upload receipts and watch the magic happen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-8 rounded-2xl border border-slate-600">
              <div className="flex items-center justify-center h-64 text-slate-400">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-sky-400" />
                  <p className="text-lg">Interactive Charts & Analytics</p>
                  <p className="text-sm mt-2">Visualize your spending patterns</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
                Beautiful Analytics
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Transform your financial data into actionable insights with our comprehensive analytics dashboard and interactive charts.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  <span className="text-slate-300">Expenses by category breakdown</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  <span className="text-slate-300">Time-based spending trends</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                  <span className="text-slate-300">Custom date range filtering</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Excellence Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
            Built for Excellence
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Our full-stack application is designed with modern architecture, clean code practices, and enterprise-grade security.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
              <Shield className="w-8 h-8 text-teal-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-sky-300">Secure Architecture</h3>
              <p className="text-slate-300 text-sm">Separate frontend and backend with robust API security</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
              <Calendar className="w-8 h-8 text-teal-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-sky-300">Real-time Sync</h3>
              <p className="text-slate-300 text-sm">Instant updates across all your devices</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
              <Users className="w-8 h-8 text-teal-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-sky-300">Multi-User Ready</h3>
              <p className="text-slate-300 text-sm">Built-in support for multiple users and accounts</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
              <Star className="w-8 h-8 text-teal-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-sky-300">Premium Quality</h3>
              <p className="text-slate-300 text-sm">Clean, maintainable code with comprehensive documentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-12 rounded-3xl border border-slate-600">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of users who have already revolutionized their financial management with our powerful platform.
            </p>
            {/* <button className="bg-gradient-to-r from-teal-500 to-sky-500 px-10 py-4 rounded-full text-lg font-semibold hover:from-teal-600 hover:to-sky-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-teal-500/25">
              Start Your Free Trial Today
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <TrendingUp className="w-8 h-8 text-teal-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
              TypeFlow-Finance
            </span>
          </div>
          <p className="text-center text-slate-400">
            © 2025 TypeFlow-Finance. Revolutionizing personal finance management.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;