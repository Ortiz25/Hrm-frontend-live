import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import Holidays from "date-holidays";
import SidebarLayout from "../components/layout/sidebarLayout";
import { useStore } from "../store/store.jsx";
import { Menu } from "lucide-react";

import { Button } from "../components/ui/button.jsx";

const localizer = momentLocalizer(moment);

// Function to fetch Kenya holidays
const getKenyaHolidays = () => {
  const hd = new Holidays("KE");
  return hd.getHolidays(2024).map((holiday) => ({
    title: holiday.name,
    start: new Date(holiday.start),
    end: new Date(holiday.end || holiday.start),
    allDay: true,
    description: holiday.type,
  }));
};

const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({
    title: "",
    startDate: null,
    endDate: null,
    description: "",
  });
  const [isHRM, setIsHRM] = useState(true); // Toggle this value to simulate HRM role
  const { activeModule, changeModule } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    changeModule("Holidays Calender");
  }, []);

  // Fetch holidays from API and combine with Kenya holidays
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch("https://api.example.com/holidays");
        const apiHolidays = await response.json();
        const kenyaHolidays = getKenyaHolidays();
        setHolidays([...apiHolidays, ...kenyaHolidays]);
      } catch (error) {
        console.error("Error fetching holidays:", error);
        // Fallback to Kenya holidays if API fails
        setHolidays(getKenyaHolidays());
      }
    };

    fetchHolidays();
  }, []);

  const handleAddHoliday = () => {
    if (
      newHoliday.title &&
      newHoliday.startDate &&
      newHoliday.endDate &&
      newHoliday.description
    ) {
      const newHolidayEvent = {
        title: newHoliday.title,
        start: newHoliday.startDate,
        end: newHoliday.endDate,
        allDay: true,
        description: newHoliday.description,
      };

      setHolidays([...holidays, newHolidayEvent]);
      setNewHoliday({
        title: "",
        startDate: null,
        endDate: null,
        description: "",
      });
    }
  };

  const handleRemoveHoliday = (holidayToRemove) => {
    setHolidays(
      holidays.filter((holiday) => holiday.title !== holidayToRemove.title)
    );
  };

  // Custom Yearly View
  const CustomYearView = ({ date, events }) => {
    const year = moment(date).year();
    const months = Array.from({ length: 12 }, (_, i) =>
      moment().month(i).format("MMMM")
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map((month) => (
          <div key={month} className="border p-4 rounded shadow">
            <h3 className="text-2xl font-bold mb-2">{month}</h3>
            {events
              .filter(
                (event) =>
                  moment(event.start).format("MMMM") === month &&
                  moment(event.start).year() === year
              )
              .map((event) => (
                <div key={event.title} className="mb-2">
                  <strong>{moment(event.start).format("DD")}:</strong>{" "}
                  {event.title} - {event.description}
                  {isHRM && (
                    <button
                      onClick={() => handleRemoveHoliday(event)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <SidebarLayout
          activeModule={activeModule}
          setActiveModule={changeModule}
        />
      )}
      <div className="flex-1 overflow-auto">
        <div className="p-4 bg-white shadow-md flex justify-between items-center">
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </Button>
          <h1 className="text-xl font-bold">{activeModule}</h1>
        </div>

        <div className="flex flex-col items-center p-4 shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Holiday Calendar</h1>
          <Calendar
            localizer={localizer}
            events={holidays}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600, width: "100%" }}
            views={{
              month: true,
              week: true,
              day: true,
              agenda: true,
            }}
            defaultView={Views.MONTH}
            className="border shadow-2xl rounded"
          />

          {isHRM && (
            <div className="mt-10 mb-5 p-4 border rounded shadow-lg w-2/4">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Add Holiday
              </h2>
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Holiday Name</label>
                  <input
                    type="text"
                    value={newHoliday.title}
                    onChange={(e) =>
                      setNewHoliday({ ...newHoliday, title: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                    placeholder="Enter holiday name"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Description</label>
                  <textarea
                    value={newHoliday.description}
                    onChange={(e) =>
                      setNewHoliday({
                        ...newHoliday,
                        description: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full"
                    placeholder="Enter holiday description"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Start Date</label>
                  <DatePicker
                    selected={newHoliday.startDate}
                    onChange={(date) =>
                      setNewHoliday({ ...newHoliday, startDate: date })
                    }
                    className="border p-2 rounded w-full"
                    placeholderText="Select start date"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">End Date</label>
                  <DatePicker
                    selected={newHoliday.endDate}
                    onChange={(date) =>
                      setNewHoliday({ ...newHoliday, endDate: date })
                    }
                    className="border p-2 rounded w-full"
                    placeholderText="Select end date"
                  />
                </div>
                <button
                  onClick={handleAddHoliday}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Add Holiday
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HolidayCalendar;
