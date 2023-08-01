// /admin/ticket/mechanic/update/:id
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function ManageData() {
  const [searchedTicket, setSearchedTicket] = useState([]);
  const [search, setSearch] = useState("");
  const [updatedData, setUpdatedData] = useState((prevState) => {
    return {
      customerId: data.customerId._id || prevState.customerId._id,
      customerEmail: data.customerId.email || prevState.customerId.email,
      cleanerId: data.cleanerId || prevState.cleanerId,
      scheduleOfService: data.scheduleOfService || prevState.scheduleOfService,
      typesOfServices: data.typesOfServices || prevState.typesOfServices,
      otherServiceTypeText:
        data.otherServiceTypeText || prevState.otherServiceTypeText,
      modeOfService: data.modeOfService || prevState.modeOfService,
      query: data.query || prevState.query,
      picturesOfCar: {
        front: data.picturesOfCar?.front || prevState.picturesOfCar.front,
        back: data.picturesOfCar?.back || prevState.picturesOfCar.back,
        left: data.picturesOfCar?.left || prevState.picturesOfCar.left,
        right: data.picturesOfCar?.right || prevState.picturesOfCar.right,
        engine: data.picturesOfCar?.engine || prevState.picturesOfCar.engine,
      },
      description: data.description || prevState.description,
      status: data.status || prevState.status,
      currentLocation: data.currentLocation || prevState.currentLocation,
      trackingLocation: data.trackingLocation || prevState.trackingLocation,
      distance: data.distance || prevState.distance,
      totalPrice: data.totalPrice || prevState.totalPrice,
      paymentMode: data.paymentMode || prevState.paymentMode,
      paymentStatus: data.paymentStatus || prevState.paymentStatus,
      pickupPlace: data.pickupPlace || prevState.pickupPlace,
      pickupDate: data.pickupDate || prevState.pickupDate,
      pickupTime: data.pickupTime || prevState.pickupTime,
      dropPlace: data.dropPlace || prevState.dropPlace,
      dropDate: data.dropDate || prevState.dropDate,
      dropTime: data.dropTime || prevState.dropTime,
    };
  });

  var token = Cookies.get("managerToken") || Cookies.get("adminToken");

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
        setSearchedTicket(searchedData);
      }
    });
    // console.log(searchedTicket);
  };

  const onReset = async (e) => {
    e.preventDefault();
    setSearch("");
    setSearchedTicket([]);
  };

  const onUpdate = async (ticketId, updatedData) => {
    try {
      const res = await axios.put(
        `https://service-provider-apis.onrender.com/api/v1/admin/ticket/mechanic/update/${ticketId}`,
        updatedData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.status === 200) {
        // Ticket updated successfully
        const updatedTicket = res.data.ticket;
        setSearchedTicket((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === updatedTicket._id ? updatedTicket : ticket
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex">
        <div className="m-4 flex-1 text-center justify-center bg-slate-500">
          <h1 className="text-3xl font-bold my-5">Dynamic Data Edit: </h1>
          <div className="justify-start text-start mx-4 bg-white">
            <form></form>
          </div>
        </div>
        <div className="border-r border-black my-3" />
        <div className="m-4 flex-1 text-center justify-center bg-slate-400">
          <h1 className="text-3xl font-bold my-4">Actual On-Time Data: </h1>
          <div className="grid grid-cols-1 grid-rows-2 bg-gray-300 border m-5 p-2 space-y-2 space-x-2">
            <input
              type="text"
              placeholder="Ticket ID"
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
            </div>

            <div className="bg-white col-span-3" id="export-table">
              {searchedTicket.length > 0 && (
                <div className="grid grid-rows-1 grid-cols-4">
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
                                : ticket.cleanerId
                                ? ticket.cleanerId
                                : "No Data"}
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
                            <td className="border">
                              {ticket.scheduleOfService}
                            </td>
                          </tr>
                          <tr>
                            <td className="border">Total Price</td>
                            <td className="border">{ticket.totalPrice}</td>
                          </tr>
                          <tr>
                            <td className="border">Tracking Location</td>
                            <td className="border">
                              {ticket.trackingLocation}
                            </td>
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
        </div>
      </div>
    </>
  );
}
