import { useState } from "react";
import CleanerTicket from "../components/cleanerTicket";
import DriverTicket from "../components/driverTicket";
import MechanicTicket from "../components/mechanicTicket";

export default function SubmitTicket() {
  const [selectedTicketType, setSelectedTicketType] = useState("");

  const handleTicketTypeChange = (event) => {
    setSelectedTicketType(event.target.value);
  };

  const renderTicketForm = () => {
    switch (selectedTicketType) {
      case "cleaner":
        return <CleanerTicket />;
      case "driver":
        return <DriverTicket />;
      case "mechanic":
        return <MechanicTicket />;
      default:
        return null;
    }
  };
  return (
    <div className="flex items-center justify-center">
      <div className="py-8 justify-items-center text-center">
        <h1 className="text-3xl font-bold mb-4">Submit Ticket</h1>
        <label htmlFor="ticketType" className="block mb-2">
          Select Ticket Type:
        </label>
        <select
          id="ticketType"
          value={selectedTicketType}
          onChange={handleTicketTypeChange}
          className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 mx-auto"
        >
          <option value="">Select</option>
          <option value="cleaner">Cleaner</option>
          <option value="driver">Driver</option>
          <option value="mechanic">Mechanic</option>
        </select>

        <div className="flex items-center justify-center">
          {renderTicketForm()}
        </div>
      </div>
    </div>
  );
}
