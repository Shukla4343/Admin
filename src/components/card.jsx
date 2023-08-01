import React from "react";
import { useNavigate } from "react-router-dom";

export default function Card(props) {
  const navigate = useNavigate();
  const handleClick = () => navigate(props.link);
  return (
    <div className="card bg-white rounded-lg shadow-md h-60 text-center">
      <div className="p-4">
        <h2 className="text-xl font-medium">{props.heading}</h2>
        <p className="mt-2 text-gray-600">{props.data}</p>
        <button className="mt-5 px-4 py-2 bg-teal-500 text-white rounded-md" onClick={handleClick}>
          {props.buttonName}
        </button>
      </div>
    </div>
  );
}
