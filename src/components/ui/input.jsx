export const Input = ({ type = "text", className, ...props }) => (
  <input
    type={type}
    className={`border-4 rounded-md p-2 w-full ${className}`}
    {...props}
  />
);
