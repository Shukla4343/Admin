import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import Cookies from "js-cookie";

export default function NavBar() {
  const [navbar, setNavbar] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    !!Cookies.get("adminToken") || !!Cookies.get("managerToken")
  );
  const { logout } = useContext(AuthContext);

  let fullName = "";
  const adminData = Cookies.get("adminData");
  const managerData = Cookies.get("managerData");
  try {
    const parsedAdminData = adminData ? JSON.parse(adminData) : null;
    const parsedManagerData = managerData ? JSON.parse(managerData) : null;
    if (parsedAdminData && parsedAdminData.fullName) {
      fullName = parsedAdminData.fullName;
    } else if (parsedManagerData && parsedManagerData.fullName) {
      fullName = parsedManagerData.fullName;
    }
  } catch (error) {
    console.error("Error parsing JSON data from cookies:", error);
    // Handle the error gracefully, e.g., show an error message to the user
  }

  const handleLogout = () => {
    setLoggedIn(false);
    logout();
  };

  return (
    <div className="">
      <nav className="bg-teal-500 shadow rounded-b-xl">
        <div className="w-full justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div>
            <div className="flex items-center justify-between py-3 md:py-5 md:block">
              <a href="/dashboard">
                <h2 className="text-2xl font-bold text-white">HELPY MOTO</h2>
              </a>
              <div className="md:hidden">
                <button
                  className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                navbar ? "block" : "hidden"
              }`}
            >
              <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                <li className="text-white hover:text-indigo-200">
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li className="text-white hover:text-indigo-200">
                  <a href="/submitTicket">Submit Ticket</a>
                </li>
                <li className="text-white hover:text-indigo-200">
                  <a href="/myTickets">My Ticket</a>
                </li>
              </ul>

              {navbar && (
                <div className="mt-3 space-y-2 lg:hidden md:inline-block">
                  {loggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="inline-block w-full px-4 py-2 text-center text-black bg-white rounded-md shadow hover:bg-teal-500 hover:text-white"
                    >
                      Log out
                    </button>
                  ) : (
                    <a
                      href="/"
                      className="inline-block w-full px-4 py-2 text-center text-black bg-white rounded-md shadow hover:bg-teal-500 hover:text-white"
                    >
                      Log in
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="hidden space-x-2 md:inline-block">
            {loggedIn ? (
              <>
                <span className="text-white m-2">{fullName}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-black bg-white rounded-md shadow hover:bg-white hover:text-teal-500"
                >
                  Log out
                </button>
              </>
            ) : (
              <a
                href="/"
                className="px-4 py-2 text-black bg-white rounded-md shadow hover:bg-white hover:text-teal-500"
              >
                Log in
              </a>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
