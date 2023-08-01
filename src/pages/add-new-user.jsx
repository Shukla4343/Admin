import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function AddNewUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    page1: {
      role: "",
    },
    page2: {
      name: "",
      email: "",
      address: "",
      pincode: "",
      phoneNo: "",
    },
    page3: {
      aadharCard: "",
      drivingLicense: "",
      panCard: "",
      // gstNumber: "", // This might change later based on what sir decides
    },
    page4: {
      organizationName: "",
      ownerName: "",
      ownerNumber: "",
    },
    page5: {
      accountType: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
    },
  });

  var token = Cookies.get("managerToken") || Cookies.get("adminToken");
  // console.log(token);

  const transformedData = {
    role: formData.page1.role,
    generalDetails: {
      fullName: formData.page2.name,
      email: formData.page2.email,
      phoneNo: formData.page2.phoneNo,
      address: formData.page2.address,
      pincode: formData.page2.pincode,
    },
    documentDetails: {
      aadhaarNo: formData.page3.aadharCard,
      drivingLicenceNo: formData.page3.drivingLicense,
      panCardNo: formData.page3.panCard,
    },
    bankDetails: {
      bankAccountType: formData.page5.accountType,
      accountHolderName: formData.page5.accountHolderName,
      bankAccountNo: formData.page5.accountNumber,
      ifscCode: formData.page5.ifscCode,
    },
    workshopDetails: {
      organization: {
        orgName: formData.page4.organizationName,
        ownerName: formData.page4.ownerName,
        ownerPhoneNo: formData.page4.ownerNumber,
      },
    },
  };

  // console.log(transformedData);

  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [`page${currentPage}`]: {
        ...prevFormData[`page${currentPage}`],
        [name]: value,
      },
    }));
  };

  const handleNext = () => {
    if (currentPage === 1 && !formData.page1.role) {
      // Check if role is selected on page 1
      return;
    } else if (currentPage === 2 && !validatePage2()) {
      // Check if all fields on page 2 are filled
      return;
    } else if (currentPage === 3 && !validatePage3()) {
      // Check if all fields on page 3 are filled
      return;
    } else if (currentPage === 4 && !validatePage4()) {
      // Check if all fields on page 4 are filled
      return;
    } else if (currentPage === 5 && !validatePage5()) {
      // Check if all fields on page 5 are filled
      return;
    }
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const validatePage2 = () => {
    const { name, email, address, pincode, phoneNo } = formData.page2;
    return name && email && address && pincode && phoneNo;
  };

  const validatePage3 = () => {
    const { aadharCard, drivingLicense, panCard } = formData.page3;
    return aadharCard && drivingLicense && panCard;
  };

  const validatePage4 = () => {
    const { organizationName, ownerName, ownerNumber } = formData.page4;
    return organizationName && ownerName && ownerNumber;
  };

  const validatePage5 = () => {
    const { accountHolderName, accountNumber, ifscCode } = formData.page5;
    return accountHolderName && accountNumber && ifscCode;
  };

  const handleBack = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data
    // console.log(transformedData);
    sendData();
  };

  const sendData = async () => {
    try {
      const response = await axios.post(
        "https://service-provider-apis.onrender.com/api/v1/admin/create/mechanic",
        transformedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (res.data.success) {
        alert("User Created Successfully");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderFormPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="flex items-center justify-center">
            <div className="py-8 justify-items-center text-center">
              <h2 className="text-3xl font-bold mb-2">Add New Service Provider</h2>
              <h2 className="text-3xl font-bold mb-4">Step 1: Select Role</h2>
              <label htmlFor="role" className="block mb-2">
                Select Role:
              </label>
              <select
                id="role"
                name="role"
                autoComplete="off"
                required
                value={formData.page1.role}
                onChange={handleChange}
                className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 mx-auto"
              >
                <option value="">Select Role</option>
                <option value="mechanic">Mechanic</option>
                <option value="driver">Driver</option>
                <option value="cleaner">Cleaner</option>
              </select>

              <div className="flex justify-center mt-2">
                <button
                  onClick={handleNext}
                  className="bg-teal-500 text-white my-5 px-8 py-2 rounded text-sm w-auto"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center">
            <div className="py-8 justify-items-center text-center">
              <h2 className="text-3xl font-bold mb-4">
                Step 2: Enter Personal Information
              </h2>
              <div>
                <label htmlFor="name" className="flex mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="off"
                  required
                  value={formData.page2.name}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="email" className="flex my-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="off"
                  required
                  value={formData.page2.email}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="address" className="flex my-2">
                  Address:
                </label>
                <textarea
                  type="text"
                  id="address"
                  name="address"
                  autoComplete="off"
                  required
                  value={formData.page2.address}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full h-20"
                />
                <div>
                  <label htmlFor="pincode" className="flex my-2">
                    Pincode:
                  </label>
                  <input
                    type="number"
                    id="pincode"
                    name="pincode"
                    autoComplete="off"
                    required
                    value={formData.page2.pincode}
                    onChange={handleChange}
                    className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNo" className="flex my-2">
                    Phone Number:
                  </label>
                  <input
                    type="number"
                    id="phoneNo"
                    name="phoneNo"
                    autoComplete="off"
                    required
                    value={formData.page2.phoneNo}
                    onChange={handleChange}
                    className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-teal-500 text-white my-5 px-8 py-2 rounded text-sm w-auto"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-teal-500 text-white my-5 px-8 py-2 rounded text-sm w-auto"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center">
            <div className="py-8 justify-items-center text-center">
              <h2 className="text-3xl font-bold mb-4">
                Step 3: Upload ID Proof
              </h2>
              {/* Add inputs for Page 3 */}
              <div>
                <label htmlFor="aadharCard" className="flex my-2">
                  Aadhar Card Number:
                </label>
                <input
                  type="number"
                  id="aadharCard"
                  name="aadharCard"
                  autoComplete="off"
                  required
                  value={formData.page3.aadharCard}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="panCard" className="flex my-2">
                  Pan Card Number:
                </label>
                <input
                  type="text"
                  id="panCard"
                  name="panCard"
                  autoComplete="off"
                  required
                  value={formData.page3.panCard}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="drivingLicense" className="flex my-2">
                  Driving License Number:
                </label>
                <input
                  type="text"
                  id="drivingLicense"
                  name="drivingLicense"
                  autoComplete="off"
                  required
                  value={formData.page3.drivingLicense}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                />
              </div>
              {/* <div>
                <label htmlFor="gstNumber" className="flex my-2">
                  GST Number:
                </label>
                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  autoComplete="off"
                  required
                  value={formData.page3.gstNumber}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                />
              </div> */}
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-teal-500 text-white my-5 px-8 py-2 rounded text-sm w-auto"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-teal-500 text-white my-5 px-8 py-2 rounded text-sm w-auto"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex items-center justify-center">
            <div className="py-8 justify-items-center text-center">
              <h2 className="text-3xl font-bold mb-4">
                Step 4: Enter Workshop Details
              </h2>
              <div>
                <label htmlFor="organizationName" className="flex my-2">
                  Organization Name:
                </label>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  autoComplete="off"
                  required
                  value={formData.page4.organizationName}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="ownerName" className="flex my-2">
                  Owner Name:
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  autoComplete="off"
                  required
                  value={formData.page4.ownerName}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="ownerNumber" className="flex my-2">
                  Owner Number:
                </label>
                <input
                  type="number"
                  id="ownerNumber"
                  name="ownerNumber"
                  autoComplete="off"
                  required
                  value={formData.page4.ownerNumber}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                />
              </div>
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-teal-500 text-white my-5 px-8 py-2 rounded text-sm w-auto"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-teal-500 text-white my-5 px-8 py-2 rounded text-sm w-auto"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex items-center justify-center">
            <div className="py-8 justify-items-center text-center">
              <h2 className="text-3xl font-bold mb-4">
                Step 5: Enter Bank Details
              </h2>
              <div>
                <label htmlFor="accountType" className="flex my-2">
                  Account Type:
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  autoComplete="off"
                  required
                  value={formData.page5.accountType}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                >
                  <option value="">Select Account Type</option>
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                </select>
              </div>
              <div>
                <label htmlFor="accountHolderName" className="flex my-2">
                  Account Holder Name:
                </label>
                <input
                  type="text"
                  id="accountHolderName"
                  name="accountHolderName"
                  autoComplete="off"
                  required
                  value={formData.page5.accountHolderName}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="accountNumber" className="flex my-2">
                  Account Number:
                </label>
                <input
                  type="number"
                  id="accountNumber"
                  name="accountNumber"
                  autoComplete="off"
                  required
                  value={formData.page5.accountNumber}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="ifscCode" className="flex my-2">
                  IFSC Code:
                </label>
                <input
                  type="text"
                  id="ifscCode"
                  name="ifscCode"
                  autoComplete="off"
                  required
                  value={formData.page5.ifscCode}
                  onChange={handleChange}
                  className="block border-gray-300 focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm py-2 w-full"
                />
              </div>
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-teal-500 text-white my-5 px-8 py-2 rounded text-sm w-auto"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 text-white my-5 px-8 py-2 rounded text-sm w-auto"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>{renderFormPage()}</form>
    </div>
  );
}
