// UserTypeSelection.js
import React, { useState } from "react";
import { FaUser, FaGavel } from "react-icons/fa";

const UserHandler = ({ onSelectUserType }) => {
  const [selectedType, setSelectedType] = useState(null);

  const handleUserTypeSelection = (userType) => {
    setSelectedType(userType);
    onSelectUserType(userType);
  };

  return (
    <>
 
    <div className="container mt-5">
     
      <div className="row justify-content-center">
        <button
          className={`btn btn-${
            selectedType === "client" ? "success" : "outline-success"
          } m-2`}
          onClick={() => handleUserTypeSelection("client")}
        >
          <FaUser size={40} className="mb-2" />
          <br />
          Client
        </button>
        <button
          className={`btn btn-${
            selectedType === "lawyer" ? "primary" : "outline-primary"
          } m-2`}
          onClick={() => handleUserTypeSelection("lawyer")}
        >
          <FaGavel size={40} className="mb-2" />
          <br />
          Lawyer
        </button>
      </div>
    </div>
    </>
  );
};

export default UserHandler;
