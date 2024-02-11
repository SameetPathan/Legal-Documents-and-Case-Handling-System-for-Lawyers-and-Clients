// UserTypeSelection.js
import React, { useState } from "react";
import { FaUser, FaGavel } from "react-icons/fa";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

const UserHandler = ({ onSelectUserType }) => {
  const [selectedType, setSelectedType] = useState(null);

  const handleUserTypeSelection = (userType) => {
    setSelectedType(userType);
    //onSelectUserType(userType);
  };

  return (
    <>
 
    <div className="container mt-5">
     
      <div className="row justify-content-center">
        <Link to="/client"
          className={`btn btn-${
            selectedType === "client" ? "success" : "outline-success"
          } m-2`}
          onClick={() => handleUserTypeSelection("client")}
        >
          <FaUser size={40} className="mb-2" />
          <br />
          Client
        </Link>
        <Link to="/lawyer"
          className={`btn btn-${
            selectedType === "lawyer" ? "primary" : "outline-primary"
          } m-2`}
          onClick={() => handleUserTypeSelection("lawyer")}
        >
          <FaGavel size={40} className="mb-2" />
          <br />
          Lawyer
        </Link>
      </div>
    </div>
    </>
  );
};

export default UserHandler;
