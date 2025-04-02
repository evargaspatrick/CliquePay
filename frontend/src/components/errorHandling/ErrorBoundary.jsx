// src/components/ErrorBoundary.jsx
import React from 'react';
import PropTypes from 'prop-types'; // Add this import
import { Link, useNavigate, useRouteError } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search, CreditCard, AlertTriangle } from "lucide-react";
import { Button } from "../../components/ui/button"; // Corrected the import path
import GalaxyVisualization from '../designs/galaxy-visualization'; // Corrected the import path

// Class component for catching React errors
class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // You could send to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Add PropTypes for the class component
ErrorBoundaryClass.propTypes = {
  children: PropTypes.node.isRequired
};

// Update the ErrorDisplay to properly handle both bound errors and route errors
export function ErrorDisplay({ error }) {
  const navigate = useNavigate();
  const routeError = useRouteError(); // For React Router errors
  
  // Use either passed error or route error
  const actualError = error || routeError;
  
  // Determine if it's a 404 error
  const is404 = actualError?.status === 404 || 
                actualError?.message?.includes("not found") ||
                window.location.pathname !== '/';
  
  // Determine the error message to display
  const errorMessage = actualError?.message || "An unexpected error occurred";
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Galaxy Background */}
      <GalaxyVisualization />
      
      {/* Content should be positioned above the galaxy visualization */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto py-6 px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-purple-600 w-8 h-8 rounded-md flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl">CliquePay</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-3xl mx-auto text-center">
            {/* Error Code Animation */}
            <div className="relative h-48 mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-[10rem] font-bold text-zinc-800">
                  {is404 ? "404" : "500"}
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  {is404 ? "404" : "500"}
                </span>
              </motion.div>
            </div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {is404 ? "Page Not Found" : "Something Went Wrong"}
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto">
                {is404 
                  ? "The page you're looking for doesn't exist or has been moved."
                  : "We encountered an unexpected error while processing your request."}
              </p>
              {/* Show error details if not a 404 */}
              {!is404 && actualError && (
                <div className="mb-8 text-left mx-auto max-w-lg">
                  <p className="text-red-400 p-4 bg-red-900/20 border border-red-900 rounded-md">
                    {errorMessage}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Visual Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mb-12 relative"
            >
              <div className="w-24 h-24 mx-auto relative">
                <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {is404 ? (
                    <Search className="w-12 h-12 text-purple-400" />
                  ) : (
                    <AlertTriangle className="w-12 h-12 text-purple-400" />
                  )}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full"></div>
              <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-purple-600 rounded-full"></div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
                <Link to="/">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-zinc-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} CliquePay. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link to="/help" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Help
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Add PropTypes for ErrorDisplay
ErrorDisplay.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    status: PropTypes.number,
    stack: PropTypes.string
  })
};

// Default props
ErrorDisplay.defaultProps = {
  error: null
};

// Default export is the class-based ErrorBoundary
function ErrorBoundary({ children }) {
  return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
}

// Add PropTypes for the default export
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;