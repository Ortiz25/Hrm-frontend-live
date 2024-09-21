import { useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Search } from "lucide-react";
import { Result } from "postcss";

const EmployeeSearch = ({ employees, onSelectEmployee, onDataSend }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    setSearchResults(results);
    onDataSend(results);

    console.log("Result", results);
  };

  // Perform search
  const results = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative ">
      <Label htmlFor="employee-search">Search Employee</Label>
      <div className="relative">
        <Input
          id="employee-search"
          type="text"
          placeholder="Search by name or position"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      {searchResults.length > 0 && searchTerm && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto">
          {searchResults.map((employee) => (
            <li
              key={employee.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectEmployee(employee)}
            >
              {employee.name} - {employee.position}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeSearch;
