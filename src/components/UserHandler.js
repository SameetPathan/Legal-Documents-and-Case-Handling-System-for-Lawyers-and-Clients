// UserTypeSelection.js
import React, { useState, useEffect } from "react";
import { FaUser, FaGavel } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { profileABI, profileAddress } from "./contractAddress";

const UserHandler = (props) => {
  const [selectedType, setSelectedType] = useState(null);
  const [account, setAccount] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const handleUserTypeSelection = (userType) => {
    setSelectedType(userType);
  };


  const handleGetProfile = async (e) => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_accounts" });
      setAccount(accounts[0]);

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const ProfileContract = new ethers.Contract(
          profileAddress,
          profileABI,
          signer
        );

        const isprofile = await ProfileContract.userExists(accounts[0]);

        if(isprofile){
          const profile = await ProfileContract.getProfileById(accounts[0]);
          props.setuserDetails(profile)
          setUserProfile(profile);
        }else{
          setUserProfile("new");
        }
        
        
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetProfile();
  
  }, []);

  const renderDashboardButtons = () => {
    if (!userProfile) {
      return null; // Profile not loaded yet
    }

    const userType = userProfile[4]; // Assuming userType is the 5th element in the array

    switch (userType) {
      case "new":
        return (
          <Link
          to="/profile"
          className={`btn btn-${
            selectedType === "client" ? "success" : "outline-success"
          } m-2`}
          onClick={() => handleUserTypeSelection("profile")}
        >
          <FaUser size={40} className="mb-2" />
          <br />
          Profile Dashboard
        </Link>
        );
      case "client":
        return (
          <Link
          to="/client"
          className={`btn btn-${
            selectedType === "client" ? "success" : "outline-success"
          } m-2`}
          onClick={() => handleUserTypeSelection("client")}
        >
          <FaUser size={40} className="mb-2" />
          <br />
          Welcome to Client Dashboard
        </Link>
        );
      case "lawyer":
        return (
          <Link
          to="/lawyer"
          className={`btn btn-${
            selectedType === "lawyer" ? "primary" : "outline-primary"
          } m-2`}
          onClick={() => handleUserTypeSelection("lawyer")}
        >
          <FaGavel size={40} className="mb-2" />
          <br />
          Welcome to Lawyer Dashboard
        </Link>
        );
      case "admin":
        return (
          <Link
          to="/admin"
          className={`btn btn-${
            selectedType === "admin" ? "primary" : "outline-primary"
          } m-2`}
          onClick={() => handleUserTypeSelection("admin")}
        >
          <FaGavel size={40} className="mb-2" />
          <br />
          Admin
        </Link>
        );
      case "master":
        return(
          <>
          <Link
          to="/client"
          className={`btn btn-${
            selectedType === "client" ? "success" : "outline-success"
          } m-2`}
          onClick={() => handleUserTypeSelection("client")}
        >
          <FaUser size={40} className="mb-2" />
          <br />
          Welcome to Client Dashboard
        </Link>
        <Link
        to="/lawyer"
        className={`btn btn-${
          selectedType === "lawyer" ? "primary" : "outline-primary"
        } m-2`}
        onClick={() => handleUserTypeSelection("lawyer")}
      >
        <FaGavel size={40} className="mb-2" />
        <br />
        Welcome to Lawyer Dashboard
      </Link>
      <Link
      to="/admin"
      className={`btn btn-${
        selectedType === "admin" ? "primary" : "outline-primary"
      } m-2`}
      onClick={() => handleUserTypeSelection("admin")}
    >
      <FaGavel size={40} className="mb-2" />
      <br />
      Welcome to Admin Dashboard
    </Link>

          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          {renderDashboardButtons()}
          
        </div>
      </div>
    </>
  );
};

export default UserHandler;
