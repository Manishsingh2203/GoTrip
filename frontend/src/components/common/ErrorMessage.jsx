import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-800 text-sm">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;