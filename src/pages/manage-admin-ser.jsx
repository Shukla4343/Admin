import { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";

export default function ManageAdminUser() {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchedData, setSearchedData] = useState([]);
  const [search, setSearch] = useState("");

  var token = Cookies.get("managerToken") || Cookies.get("adminToken");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await axios.get(
      "https://service-provider-apis.onrender.com/api/v1/admin/getAllEntities",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const newData = response.data.user.filter(
      (element) => element.role === "admin" || element.role === "manager"
    );
    setUserData(newData);
    setTotalUsers(newData.length);
  };

  // console.log(userData);
  const handleBulkExport = () => {
    exportUserData(userData, "Admin and Manager.xlsx");
  };

  const handleSearchExport = () => {
    if (searchedData.length === 0) {
      return;
    }
    exportUserData(searchedData, "searched_users.xlsx");
  };

  const exportUserData = (data, filename) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Admin and Manager");

    const excelBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    });

    const filedata = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(filedata, filename);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const onSearch = async (e) => {
    e.preventDefault();
    if (search === "") {
      return;
    }
    try {
      const res = await axios.get(
        `https://service-provider-apis.onrender.com/api/v1/admin/getAllEntities`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const searchData = res.data;
      const data = searchData.user.filter(
        (element) => element.role === "admin" || element.role === "manager"
      );
      // console.log(data);
      if (res.status === 201) {
        // setSearch("");
        onSearchRender(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSearchRender = (data) => {
    // console.log(typeof(searchData));
    const searchedData = [];
    data.filter((user) => {
      if (user._id.includes(search)) {
        searchedData.push(user);
        setSearchedData(searchedData);
      }
    });
    console.log(searchedData);
  };

  const onReset = async (e) => {
    e.preventDefault();
    setSearch("");
    setSearchedData([]);
  };

  const handleSingleDelete = async (userId) => {
    if (userId === "" || userId === undefined) {
      return;
    } else {
      try {
        const res = await axios.delete(
          `https://service-provider-apis.onrender.com/api/v1/admin/user/delete/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (res.status === 201) {
          setSearch("");
          setSearchedData([]);
          getData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="px-5 items-center justify-center">
      <div className="py-8 justify-items-center text-center">
        <h1 className="text-3xl font-bold mb-4">Admin and Manager Data</h1>

        <div className="bg-gray-300 p-5">
          <div className="bg-white p-5 ">
            <table className="min-w-full divide-y divide-gray-200 text-center">
              <thead className="bg-gray-50 border border-gray-700 text-center">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider border border-gray-700"
                  >
                    User ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider border border-gray-700"
                  >
                    Full Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider border border-gray-700"
                  >
                    Email ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider border border-gray-700"
                  >
                    Phone No.
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider border border-gray-700"
                  >
                    Role
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200 border border-gray-700">
                {currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-700">
                      {user._id ?? "No data found"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-700">
                      {user.fullName ?? "No data found"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-700">
                      {user.email ?? "No data found"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-700">
                      {user.phoneNo ?? "No data found"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-700">
                      {user.role === "admin"
                        ? "Admin"
                        : user.role === "manager"
                        ? "Manager"
                        : "No Data Found"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <nav className="flex items-center justify-between space-x-8">
              <button
                className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="text-sm text-gray-700">
                Page {currentPage} of {Math.ceil(totalUsers / usersPerPage)}
              </div>
              <button
                className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(totalUsers / usersPerPage)}
              >
                Next
              </button>
              <button
                onClick={handleBulkExport}
                className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
              >
                Export Data
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-gray-300 p-5 mt-5">
          <div className="grid grid-rows-2 bg-white p-5">
            <input
              type="text"
              placeholder="Search by User ID"
              className="w-full h-12 col-span-3 grid-row-1 p-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex w-full col-span-3 items-center justify-evenly mt-3">
              <button
                className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mr-2 rounded w-full"
                onClick={onSearch}
              >
                Search
              </button>
              <button
                className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mx-2 w-full"
                onClick={onReset}
              >
                Reset
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2 w-full"
                onClick={handleSearchExport}
              >
                Export
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2 w-full"
                onClick={() => handleSingleDelete(search)}
              >
                Delete User
              </button>
            </div>
            <div className="bg-white col-span-3" id="export-table">
              {searchedData.length > 0 && (
                <div className="grid grid-rows-1 grid-cols-4">
                  <div className="col-span-4">
                    <h1 className="text-2xl font-bold p-5">Search Results: </h1>
                  </div>
                  <div className="m-5 col-span-4 grid ">
                    <table className="border border-gray-700">
                      <thead>
                        <tr>
                          <th className="border">User Component</th>
                          <th className="border">User Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchedData.map((user) => (
                          <tr key={user._id}>
                            <td className="border">User ID</td>
                            <td className="border">{user._id}</td>
                          </tr>
                        ))}
                        {searchedData.map((user) => (
                          <tr key={user._id}>
                            <td className="border">User Name</td>
                            <td className="border">{user.fullName}</td>
                          </tr>
                        ))}
                        {searchedData.map((user) => (
                          <tr key={user._id}>
                            <td className="border">User Contact</td>
                            <td className="border">
                              {user.phoneNo ? user.phoneNo : "No Data"}
                            </td>
                          </tr>
                        ))}
                        {searchedData.map((user) => (
                          <tr key={user._id}>
                            <td className="border">User Email</td>
                            <td className="border">{user.email}</td>
                          </tr>
                        ))}
                        {searchedData.map((user) => (
                          <tr key={user._id}>
                            <td className="border">User Unique ID</td>
                            <td className="border">{user.userUid}</td>
                          </tr>
                        ))}
                        {searchedData.map((user) => (
                          <tr key={user._id}>
                            <td className="border">User Location</td>
                            <td className="border">
                              {user.currentLocation.length > 0
                                ? user.currentLocation
                                : "No Data"}
                            </td>
                          </tr>
                        ))}
                        {searchedData.map((user) => (
                          <tr key={user._id}>
                            <td className="border">User Vehicle ID</td>
                            <td className="border">
                              {user.vehicleId.length > 0
                                ? user.vehicleId
                                : "No Data"}
                            </td>
                          </tr>
                        ))}
                        {searchedData.map((user) => (
                          <tr key={user._id}>
                            <td className="border">User Photo</td>
                            <td className="border">
                              {user.photo ? (
                                <img
                                  src={user.photo}
                                  alt="User Photo"
                                  className="w-20 h-20"
                                />
                              ) : (
                                "No Data"
                              )}
                            </td>
                          </tr>
                        ))}
                        {searchedData.map((user) => (
                          <tr key={user._id}>
                            <td className="border">User Account Disable</td>
                            <td className="border">
                              {user.accountDisable.toString()}
                            </td>
                          </tr>
                        ))}
                        {searchedData.map((user) => (
                          <tr key={user._id}>
                            <td className="border">User Created at</td>
                            <td className="border">
                              {new Date(user.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
