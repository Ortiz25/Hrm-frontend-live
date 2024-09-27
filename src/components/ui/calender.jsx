import React, { useState } from "react";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <label htmlFor="date-picker" className="text-sm font-medium">
        Choose a Date:
      </label>
      <input
        id="date-picker"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {selectedDate && (
        <p className="text-sm text-gray-600">Selected Date: {selectedDate}</p>
      )}
    </div>
  );
}

export default Calendar;
