export const Switch = ({
  id,
  checked,
  onCheckedChange,
  className,
  ...props
}) => (
  <label
    htmlFor={id}
    className={`relative inline-flex items-center cursor-pointer ${className}`}
  >
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="sr-only"
      {...props}
    />
    <div
      className={`w-10 h-6 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-indigo-500 ${
        checked ? "bg-indigo-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`block w-4 h-4 bg-white rounded-full shadow transform transition ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </div>
  </label>
);
