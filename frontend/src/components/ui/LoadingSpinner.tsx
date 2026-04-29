import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} 
          border-4 border-gray-200 border-t-black 
          rounded-full animate-spin
        `}
      />
    </div>
  );
};

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  children,
  fallback = <LoadingSpinner />,
  errorFallback
}) => {
  if (loading) {
    return <>{fallback}</>;
  }

  if (error) {
    return (
      <>
        {errorFallback || (
          <div className="text-center py-8">
            <div className="text-red-600 font-bold mb-2">Error</div>
            <div className="text-gray-600">{error}</div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
};
