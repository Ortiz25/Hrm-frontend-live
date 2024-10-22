import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isLeaveActive = (leave) => {
  const currentDate = new Date();
  const startDate = new Date(leave.start_date);
  const endDate = new Date(leave.end_date);

  // Check if the current date falls within the start and end dates (inclusive)
  return currentDate >= startDate && currentDate <= endDate;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(value);
};

export const formatTime = (timestamp) => {
  const dateObject = new Date(timestamp);

  // Extract the time in 'HH:MM:SS' format
  const extractedTime = dateObject.toTimeString().split(" ")[0];

  return extractedTime;
};

export const formatDate = (timestamp) => {
  const dateObject = new Date();

  // Extract the date in 'YYYY-MM-DD' format
  const extractedDate = dateObject.toISOString().split("T")[0];

  return extractedDate;
};

export const formatMonth = (dateStr) => {
  const date = new Date(dateStr);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return formattedDate;
};

export const handleLeaveRequest = async (
  id,
  status,
  isModalOpen,
  setIsModalOpen,
  isUpdated,
  setIsUpdated
) => {
  try {
    console.log(id, status);

    const response = await fetch(
      `https://hrmlive.livecrib.pro/api/approve/${id}`,
      {
        method: "PUT", // Using PUT to update the approval status
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status, // Set the leave status to 'approved'
        }),
      }
    );

    // Check if the response is successful
    if (response.ok) {
      const result = await response.json();
      console.log("Leave approved:", result);

      // Show success message or toast notification
      alert("Leave approved successfully!");
      setIsUpdated(!isUpdated);
      setIsModalOpen(!isModalOpen);
    } else {
      // Handle errors returned by the server
      const errorData = await response.json();
      console.error("Error approving leave:", errorData.message);
      alert("Failed to approve leave.");
      setIsUpdated(!isUpdated);
      setIsModalOpen(!isModalOpen);
    }
  } catch (error) {
    // Handle network or other errors
    console.error("Error approving leave:", error);
  }
};
