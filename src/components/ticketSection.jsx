import Ticket from "./ticket";
import axios from "axios";
import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";

export default function TicketSection() {
  const [cleanerTickets, setCleanerTickets] = useState([]);
  const [driverTickets, setDriverTickets] = useState([]);
  const [mechanicTickets, setMechanicTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedTicket, setSearchedTickets] = useState([]);
  const [tickets, setTickets] = useState([]);

  var token = Cookies.get("managerToken") || Cookies.get("adminToken");

  useEffect(() => {
    const getTickets = async () => {
      try {
        const res = await axios.get(
          "https://service-provider-apis.onrender.com/api/v1/admin/ticket/all",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const cleanerTickets = res.data.tickets.cleanerTicket;
        const driverTickets = res.data.tickets.driverTicket;
        const mechanicTickets = res.data.tickets.mechanicTicket;
        setCleanerTickets(cleanerTickets);
        setDriverTickets(driverTickets);
        setMechanicTickets(mechanicTickets);
        // console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getTickets();
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();
    if (search === "") {
      return;
    }
    try {
      const res = await axios.get(
        `https://service-provider-apis.onrender.com/api/v1/admin/ticket/all`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const searchData = res.data;
      const tickets = [];
      searchData.tickets.cleanerTicket.map((ticket) => {
        tickets.push(ticket);
      });
      searchData.tickets.driverTicket.map((ticket) => {
        tickets.push(ticket);
      });
      searchData.tickets.mechanicTicket.map((ticket) => {
        tickets.push(ticket);
      });
      // console.log(tickets);
      if (res.status === 201) {
        setSearch("");
        onSearchRender(tickets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSearchRender = (tickets) => {
    // console.log(typeof(searchData));
    const searchedData = [];
    tickets.filter((ticket) => {
      // console.log(ticket.customerId.email);
      if (
        ticket._id.includes(search) ||
        (ticket.customerId &&
          ticket.customerId.email &&
          ticket.customerId.email.includes(search))
      ) {
        searchedData.push(ticket);
        setSearchedTickets(searchedData);
      }
    });
    // console.log(searchedTicket);
  };

  const handleExport = () => {
    if (searchedTicket.length === 0) {
      return;
    }
    const transposedData = transposeData(searchedTicket);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transposedData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

    const excelBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, "tickets.xlsx");
  };

  const transposeData = (data) => {
    const keys = Object.keys(data[0]);
    const transposedData = keys.map((key) => ({
      Field: key,
      ...data.reduce((acc, obj) => {
        acc[obj._id] = obj[key];
        return acc;
      }, {}),
    }));

    return transposedData;
  };

  function handleFilter() {
    const selectedCategory = document.querySelector("select").value;
    function ticketElements() {
      if (selectedCategory === "cleaner") {
        const cleanerTicketsData = cleanerTickets;
        return cleanerTicketsData;
      }
      if (selectedCategory === "driver") {
        const driverTicketsData = driverTickets;
        return driverTicketsData;
      }
      if (selectedCategory === "mechanic") {
        const mechanicTicketsData = mechanicTickets;
        return mechanicTicketsData;
      }
      if (selectedCategory === "all") {
        const allTicketsData = cleanerTickets.concat(
          driverTickets,
          mechanicTickets
        );
        return allTicketsData;
      }
      if (selectedCategory === "none") {
        const emptyTicketsData = [];
        return emptyTicketsData;
      }
    }

    const data = ticketElements();
    setTickets(data);
    // console.log(selectedCategory);
    console.log(data);
  }

  const onReset = async (e) => {
    e.preventDefault();
    setSearch("");
    setSearchedTickets([]);
  };

  const pendingCleaner = [];
  const acceptedCleaner = [];
  const rejectedCleaner = [];
  const completedCleaner = [];
  const inProcessCleaner = [];

  const pendingDriver = [];
  const acceptedDriver = [];
  const rejectedDriver = [];
  const completedDriver = [];
  const inProcessDriver = [];

  const pendingMechanic = [];
  const acceptedMechanic = [];
  const rejectedMechanic = [];
  const completedMechanic = [];
  const inProcessMechanic = [];

  cleanerTickets.map((ticket) => {
    if (ticket.status === "pending") {
      pendingCleaner.push(ticket);
    }
    if (ticket.status === "accepted") {
      acceptedCleaner.push(ticket);
    }
    if (ticket.status === "rejected") {
      rejectedCleaner.push(ticket);
    }
    if (ticket.status === "completed") {
      completedCleaner.push(ticket);
    }
    if (ticket.status === "inProcess") {
      inProcessCleaner.push(ticket);
    }
  });

  let percentPendingCleaner = (
    (pendingCleaner.length / cleanerTickets.length) *
    100
  ).toFixed(2);
  let percentAcceptedCleaner = (
    (acceptedCleaner.length / cleanerTickets.length) *
    100
  ).toFixed(2);
  let percentRejectedCleaner = (
    (rejectedCleaner.length / cleanerTickets.length) *
    100
  ).toFixed(2);
  let percentCompletedCleaner = (
    (completedCleaner.length / cleanerTickets.length) *
    100
  ).toFixed(2);
  let percentInProcessCleaner = (
    (inProcessCleaner.length / cleanerTickets.length) *
    100
  ).toFixed(2);

  driverTickets.map((ticket) => {
    if (ticket.status === "pending") {
      pendingDriver.push(ticket);
    }
    if (ticket.status === "accepted") {
      acceptedDriver.push(ticket);
    }
    if (ticket.status === "rejected") {
      rejectedDriver.push(ticket);
    }
    if (ticket.status === "completed") {
      completedDriver.push(ticket);
    }
    if (ticket.status === "inProcess") {
      inProcessDriver.push(ticket);
    }
  });

  let percentPendingDriver = (
    (pendingDriver.length / driverTickets.length) *
    100
  ).toFixed(2);
  let percentAcceptedDriver = (
    (acceptedDriver.length / driverTickets.length) *
    100
  ).toFixed(2);
  let percentRejectedDriver = (
    (rejectedDriver.length / driverTickets.length) *
    100
  ).toFixed(2);
  let percentCompletedDriver = (
    (completedDriver.length / driverTickets.length) *
    100
  ).toFixed(2);
  let percentInProcessDriver = (
    (inProcessDriver.length / driverTickets.length) *
    100
  ).toFixed(2);

  mechanicTickets.map((ticket) => {
    if (ticket.status === "pending") {
      pendingMechanic.push(ticket);
    }
    if (ticket.status === "accepted") {
      acceptedMechanic.push(ticket);
    }
    if (ticket.status === "rejected") {
      rejectedMechanic.push(ticket);
    }
    if (ticket.status === "completed") {
      completedMechanic.push(ticket);
    }
    if (ticket.status === "inProcess") {
      inProcessMechanic.push(ticket);
    }
  });

  let percentPendingMechanic = (
    (pendingMechanic.length / mechanicTickets.length) *
    100
  ).toFixed(2);
  let percentAcceptedMechanic = (
    (acceptedMechanic.length / mechanicTickets.length) *
    100
  ).toFixed(2);
  let percentRejectedMechanic = (
    (rejectedMechanic.length / mechanicTickets.length) *
    100
  ).toFixed(2);
  let percentCompletedMechanic = (
    (completedMechanic.length / mechanicTickets.length) *
    100
  ).toFixed(2);
  let percentInProcessMechanic = (
    (inProcessMechanic.length / mechanicTickets.length) *
    100
  ).toFixed(2);

  return (
    <div>
      <h1 className="my-5 text-2xl font-bold text-center">All Tickets </h1>
      <div className="m-5 p-2 border grid grid-rows-3">
        <div className="grid grid-rows-1 grid-cols-5 space-x-5 space-y-5 border mx-3 my-5 px-3 py-5">
          <h1 className="col-span-5 text-left text-2xl font-bold px-5">
            Cleaner Tickets: {cleanerTickets.length}
          </h1>
          {cleanerTickets.length > 0 && (
            <>
              <Ticket
                status="Pending"
                progress={percentPendingCleaner}
                color={"text-red-500"}
              />
              <Ticket
                status="Accepted"
                progress={percentAcceptedCleaner}
                color={"text-green-500"}
              />
              <Ticket
                status="Rejected"
                progress={percentRejectedCleaner}
                color={"text-yellow-500"}
              />
              <Ticket
                status="Completed"
                progress={percentCompletedCleaner}
                color={"text-blue-500"}
              />
              <Ticket
                status="In Process"
                progress={percentInProcessCleaner}
                color={"text-orange-500"}
              />
            </>
          )}
          {cleanerTickets.length === 0 && (
            <h1 className="col-span-5 text-left text-2xl font-bold my-3 px-5">
              No Cleaner Tickets
            </h1>
          )}
        </div>
        <div className="grid grid-rows-1 grid-cols-5 space-x-5 space-y-5 border mx-3 my-5 px-3 py-5">
          <h1 className="col-span-5 text-left text-2xl font-bold px-5">
            Driver Tickets: {driverTickets.length}
          </h1>
          {driverTickets.length > 0 && (
            <>
              <Ticket
                status="Pending"
                progress={percentPendingDriver}
                color={"text-red-500"}
              />
              <Ticket
                status="Accepted"
                progress={percentAcceptedDriver}
                color={"text-green-500"}
              />
              <Ticket
                status="Rejected"
                progress={percentRejectedDriver}
                color={"text-yellow-500"}
              />
              <Ticket
                status="Completed"
                progress={percentCompletedDriver}
                color={"text-blue-500"}
              />
              <Ticket
                status="In Process"
                progress={percentInProcessDriver}
                color={"text-orange-500"}
              />
            </>
          )}
          {driverTickets.length === 0 && (
            <h1 className="col-span-5 text-left text-2xl font-bold my-3 px-5">
              No Driver Tickets
            </h1>
          )}
        </div>
        <div className="grid grid-rows-1 grid-cols-5 space-x-5 space-y-5 border mx-3 my-5 px-3 py-5">
          <h1 className="col-span-5 text-left text-2xl font-bold px-5">
            Mechanic Tickets: {mechanicTickets.length}
          </h1>
          {mechanicTickets.length > 0 && (
            <>
              <Ticket
                status="Pending"
                progress={percentPendingMechanic}
                color={"text-red-500"}
              />
              <Ticket
                status="Accepted"
                progress={percentAcceptedMechanic}
                color={"text-green-500"}
              />
              <Ticket
                status="Rejected"
                progress={percentRejectedMechanic}
                color={"text-yellow-500"}
              />
              <Ticket
                status="Completed"
                progress={percentCompletedMechanic}
                color={"text-blue-500"}
              />
              <Ticket
                status="In Process"
                progress={percentInProcessMechanic}
                color={"text-orange-500"}
              />
            </>
          )}
          {mechanicTickets.length === 0 && (
            <p className="col-span-5 text-left text-2xl font-bold ">
              No Mechanic Tickets
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 grid-rows-2 bg-gray-300 border m-5 p-2 space-y-2 space-x-2">
        <input
          type="text"
          placeholder="Ticket ID or Customer Email Address"
          className="w-full h-12 col-span-3 grid-row-1 p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex justify-between">
          <button
            className="w-full mr-1 bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            onClick={onSearch}
          >
            Search
          </button>
          <button
            className="w-full mx-1 bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={onReset}
          >
            Reset
          </button>
          <button
            className="w-full ml-1 bg-green-500 hover:bg-green-500-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleExport}
          >
            Export
          </button>
        </div>

        <div className="bg-white col-span-3" id="export-table">
          {searchedTicket.length > 0 && (
            <div className="grid grid-rows-1 grid-cols-4">
              <div className="col-span-4">
                <h1 className="text-2xl font-bold p-5">Search Results: </h1>
              </div>
              {searchedTicket.map((ticket) => (
                <div
                  className="m-5 col-span-4 grid grid-cols-4"
                  key={ticket._id}
                >
                  <table className="border col-span-4">
                    <thead>
                      <tr>
                        <th className="border">Ticket Component</th>
                        <th className="border">Ticket Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border">Ticket ID</td>
                        <td className="border">{ticket._id}</td>
                      </tr>
                      <tr>
                        <td className="border">Customer Email</td>
                        <td className="border">
                          {ticket.customerId
                            ? ticket.customerId.email
                            : "No Data"}
                        </td>
                      </tr>
                      <tr>
                        <td className="border">Customer ID</td>
                        <td className="border">
                          {ticket.customerId
                            ? ticket.customerId._id
                            : "No Data"}
                        </td>
                      </tr>
                      <tr>
                        <td className="border">
                          {ticket.driverId
                            ? "Driver ID"
                            : ticket.mechanicId
                            ? "Mechanic ID"
                            : "Cleaner ID"}
                        </td>
                        <td className="border">
                          {ticket.driverId
                            ? ticket.driverId
                            : ticket.mechanicId
                            ? ticket.mechanicId
                            : ticket.cleanerId}
                        </td>
                      </tr>
                      <tr>
                        <td className="border">Cleaner current Location</td>
                        <td className="border">{ticket.currentLocation}</td>
                      </tr>
                      <tr>
                        <td className="border">Status</td>
                        <td className="border">{ticket.status}</td>
                      </tr>
                      <tr>
                        <td className="border">Description</td>
                        <td className="border">{ticket.description}</td>
                      </tr>
                      <tr>
                        <td className="border">Distance</td>
                        <td className="border">{ticket.distance}</td>
                      </tr>
                      <tr>
                        <td className="border">Date of Drop</td>
                        <td className="border">{ticket.dropDate}</td>
                      </tr>
                      <tr>
                        <td className="border">Place of Drop</td>
                        <td className="border">{ticket.dropPlace}</td>
                      </tr>
                      <tr>
                        <td className="border">Time of Drop</td>
                        <td className="border">{ticket.dropTime}</td>
                      </tr>
                      <tr>
                        <td className="border">Mode of Service</td>
                        <td className="border">{ticket.modeOfService}</td>
                      </tr>
                      <tr>
                        <td className="border">Other Type of Service</td>
                        <td className="border">
                          {ticket.otherServiceTypeText}
                        </td>
                      </tr>
                      <tr>
                        <td className="border">Payment Mode</td>
                        <td className="border">{ticket.paymentMode}</td>
                      </tr>
                      <tr>
                        <td className="border">Status of Payment</td>
                        <td className="border">{ticket.paymentStatus}</td>
                      </tr>
                      <tr>
                        <td className="border">Pick-up Date</td>
                        <td className="border">{ticket.pickupDate}</td>
                      </tr>
                      <tr>
                        <td className="border">Pick-up Place</td>
                        <td className="border">{ticket.pickupPlace}</td>
                      </tr>
                      <tr>
                        <td className="border">Pick-up Time</td>
                        <td className="border">{ticket.pickupTime}</td>
                      </tr>
                      <tr>
                        <td className="border">Pictures of the Car</td>
                        <td className="border" colSpan="5">
                          {ticket.picturesOfCar ? (
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="border">
                                    {ticket.picturesOfCar.front}
                                  </td>
                                  <td className="border">
                                    {ticket.picturesOfCar.back}
                                  </td>
                                  <td className="border">
                                    {ticket.picturesOfCar.left}
                                  </td>
                                  <td className="border">
                                    {ticket.picturesOfCar.right}
                                  </td>
                                  <td className="border">
                                    {ticket.picturesOfCar.engine}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ) : (
                            <p>No pictures of the car available.</p>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="border">Query</td>
                        <td className="border">{ticket.query}</td>
                      </tr>
                      <tr>
                        <td className="border">Schedule of Service</td>
                        <td className="border">{ticket.scheduleOfService}</td>
                      </tr>
                      <tr>
                        <td className="border">Total Price</td>
                        <td className="border">{ticket.totalPrice}</td>
                      </tr>
                      <tr>
                        <td className="border">Tracking Location</td>
                        <td className="border">{ticket.trackingLocation}</td>
                      </tr>
                      <tr>
                        <td className="border">Type of Service</td>
                        <td className="border">{ticket.typesOfServices}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-300 m-5 p-2 grid grid-cols-4 grid-rows-1">
        <div className="m-2 col-span-3">
          <p className="m-2 text-left font-bold text-xl">Tickets</p>
        </div>
        <div className="m-2">
          <div className="flex justify-center items-center">
            <select className="bg-white border border-teal-500 rounded py-2">
              <option value="none" defaultChecked className="">
                Select
              </option>
              <option value="all" className="hover:bg-teal-500">All Tickets</option>
              <option value="cleaner" className="hover:bg-teal-500">Cleaner Tickets</option>
              <option value="driver" className="hover:bg-teal-500">Driver Tickets</option>
              <option value="mechanic" className="hover:bg-teal-500">Mechanic Tickets</option>
            </select>
            <button
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded m-2"
              onClick={handleFilter}
            >
              Filter
            </button>
          </div>
        </div>
        {tickets.length > 0 ? (
          <div className="m-2 col-span-4 bg-white">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border text-center">Ticket ID</th>
                  <th className="border text-center">Customer Email</th>
                  <th className="border text-center">Type</th>
                  <th className="border text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td className="border text-center">{ticket._id}</td>
                    <td className="border text-center">
                      {ticket.customerId ? ticket.customerId.email : "No Data"}
                    </td>
                    <td className="border text-center">
                      {ticket.typesOfServices}
                    </td>
                    <td className="border text-center">{ticket.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="m-2 col-span-4 bg-white">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border text-center">Ticket ID</th>
                  <th className="border text-center">Customer Email</th>
                  <th className="border text-center">Type</th>
                  <th className="border text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border text-center">No Data</td>
                  <td className="border text-center">No Data</td>
                  <td className="border text-center">No Data</td>
                  <td className="border text-center">No Data</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
