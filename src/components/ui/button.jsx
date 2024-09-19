export const Button = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 focus:hover:ring-red-500",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
