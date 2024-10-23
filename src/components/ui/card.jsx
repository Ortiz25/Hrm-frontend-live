import React from 'react';

export const Card = ({ children, className, ...props }) => (
  <div 
    className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div 
    className={`p-4 border-b border-gray-100 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 
    className={`font-semibold text-xl text-gray-800 ${className}`} 
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p 
    className={`mt-1 text-sm text-gray-600 ${className}`} 
    {...props}
  >
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div 
    className={`p-4 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div 
    className={`p-4 border-t border-gray-100 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

export const CardActions = ({ children, className, ...props }) => (
  <div 
    className={`flex items-center justify-end gap-2 ${className}`} 
    {...props}
  >
    {children}
  </div>
);