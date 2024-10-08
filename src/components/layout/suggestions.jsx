import React from "react";

const EmployeeSuggestions = ({ suggestions, onSelect }) => (
  <div className="absolute z-10 w-full mt-1 bg-red-100 border-2 border-red-500 rounded-md shadow-lg max-h-60 overflow-y-auto">
    <ul className="py-1">
      {suggestions.map((employee) => (
        <li
          key={employee.id}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ease-in-out"
          onClick={() => onSelect(employee)}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {employee.first_name[0]}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {employee.first_name} {employee.last_name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                ID: {employee.id}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default EmployeeSuggestions;
