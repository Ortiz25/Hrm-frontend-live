import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(value);
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

    const response = await fetch(`http://localhost:5174/approve/${id}`, {
      method: "PUT", // Using PUT to update the approval status
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status, // Set the leave status to 'approved'
      }),
    });

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
