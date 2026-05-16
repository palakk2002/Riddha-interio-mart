import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <FiAlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 font-display">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-6 font-bold">
              We encountered an unexpected error. Our team has been notified.
            </p>
            <div className="bg-red-50 p-4 rounded-xl text-left overflow-x-auto mb-6 border border-red-100">
              <p className="text-xs text-red-800 font-mono">
                {this.state.error?.toString()}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#001B4E] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#A29A88] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
