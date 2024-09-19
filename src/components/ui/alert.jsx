export const Alert = ({
  children,
  variant = "default",
  className,
  ...props
}) => {
  const variantClasses =
    variant === "destructive"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";
  return (
    <div className={`p-4 rounded-md ${variantClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className, ...props }) => (
  <p className={`text-md ${className}`} {...props}>
    {children}
  </p>
);
