export const Label = ({ children, htmlFor, className, ...props }) => (
  <label
    htmlFor={htmlFor}
    className={`block font-medium text-lg ${className}`}
    {...props}
  >
    {children}
  </label>
);
