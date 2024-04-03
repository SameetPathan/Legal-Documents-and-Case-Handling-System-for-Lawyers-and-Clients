import {
  FaFile,
  FaCalendarAlt,
  FaUser,
  FaMapMarkedAlt,
  FaEnvelope,
  FaCheck,
  FaPhone,
  FaBriefcase,
  FaRegFileAlt,
  FaSnapchat
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getDatabase, ref as rtdbRef, update } from "firebase/database";
import { app } from "../firebaseConfig";
import { ethers } from "ethers";
import { casesABI, casesAddress } from "./contractAddress";
import { toast } from "react-toastify";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function CaseCard({isclient,caseData, CaseId,userDetails,setcurrentCase,showtake,showclose}) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    lawyerName: "Aditya Malu",
    lawyerPhoneNumber: "8486871126",
    lawyerAddress: "Sangli",
  });

  const [account, setAccount] = useState(null);

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);


  const handleClosecase = () => {
    alert("case closed")
  };

  

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateCaseSubmit = async (caseId) => {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_accounts" });
    setAccount(accounts[0]);

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const caseContract = new ethers.Contract(
          casesAddress,
          casesABI,
          signer
        );
        let txn;
        let lawyerDetails =
          formData.lawyerName + "_" + formData.lawyerPhoneNumber;
        txn = await caseContract.updateLawyerDetails(
          caseId,
          lawyerDetails,
          formData.lawyerAddress
        );
        console.log("Mining... please wait");
        await txn.wait();
        console.log(`Mined`);
        toast.success("Case taken successfully.");

        let txn2 = await caseContract.updateCaseStatus(
          caseId,
          "Taken"
        );
        await txn2.wait();

        toast.success("Case Status updated.");

      } else {
        toast.error(
          "Error While taking Case. Please check your MetaMask connection."
        );
        console.log(`Error`);
      }
    } catch (err) {
      toast.error(
        "Error While taking Case. Please check your MetaMask connection."
      );
      console.log(err);
    }
  };

  const handleUpdateCase = async (caseId) => {
    handleUpdateCaseSubmit(caseId)
    handleModalClose();
    setFormData({
      lawyerName: "",
      lawyerPhoneNumber: "",
      lawyerAddress: "",
    });
  };

  const setcurrentCasehandle = (CaseId) => {
    debugger;
    setcurrentCase(CaseId);
  };

  useEffect(() => {
    //console.log("### caseData Details:", caseData);
  });

  return (
    <div className="card mb-4 shadow-sm">
    <div className="card-header bg-primary text-white d-flex justify-content-between">
    <h5 className="mb-0">{caseData.titleDescription.split("_")[0]}</h5>
    <span>
      <Link to="/chat"
      onClick={() => setcurrentCasehandle(CaseId)}>
      
        <FaSnapchat style={{ color: 'white' }} />
      </Link>
    </span>
  </div>

      <div className="card-body" style={{ height: "630px" }}>

      
        <ul className="list-unstyled mb-0">
          <li className="mb-2">
            <FaUser className="mr-2" />
            <strong>Client Name:</strong>{" "}
            {caseData.fullNameAndPhoneNumber.split("_")[0]}
          </li>
          <input value={CaseId} type="text" hidden />
          <li className="mb-2">
            <FaMapMarkedAlt className="mr-2" />
            <strong>Current Address:</strong> {caseData.currentAddress}
          </li>

          <li className="mb-2">
            <FaPhone className="mr-2" />
            <strong>Phone Number:</strong>{" "}
            {caseData.fullNameAndPhoneNumber.split("_")[1]}
          </li>

          <li className="mb-2">
            <FaBriefcase className="mr-2" />
            <strong>Case Type:</strong> {caseData.caseType}
          </li>

          <li className="mb-2">
            <FaRegFileAlt className="mr-2" />
            <strong>Case Description:</strong>{" "}
            {caseData.titleDescription.split("_")[1]}
          </li>

          <li className="mb-2">
            <FaFile className="mr-2" />
            <strong>Mutation Entries :</strong>
            <a
              href={caseData.documents[0]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="mr-1" />
              View Document
            </a>
          </li>

          <li className="mb-2">
            <FaFile className="mr-2" />
            <strong>Deed of Title :</strong>
            <a
              href={caseData.documents[1]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="mr-1" />
              View Document
            </a>
          </li>

          <li className="mb-2">
            <FaFile className="mr-2" />
            <strong>No Encumbrance Certificate :</strong>
            <a
              href={caseData.documents[2]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="mr-1" />
              View Document
            </a>
          </li>

          <li className="mb-2">
            <FaFile className="mr-2" />
            <strong>Search Report :</strong>
            <a
              href={caseData.documents[3]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="mr-1" />
              View Document
            </a>
          </li>

          <li className="mb-2">
            <FaFile className="mr-2" />
            <strong>Copy of FIR :</strong> {caseData.copyOfFIR}
          </li>

          <li className="mb-2">
            <FaFile className="mr-2" />
            <strong>Charsheet with Statement of Witnesses :</strong>
            <a
              href={caseData.documents[4]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="mr-1" />
              View Document
            </a>
          </li>

          {/*
          <li className="mb-2">
            <FaCalendarAlt className="mr-2" />
            <strong>Case Created on:</strong> {caseData.timestamp}
          </li>
  */}

          <li className="mb-2">
            <FaCheck className="text-success mr-2" />
            <strong>Status:</strong> {caseData.status}
          </li>
        </ul>

        <hr></hr>
        <p style={{fontWeight:"bold"}}>Lawyer Details</p>
        <hr></hr>

        <li className="mb-2">
            <FaUser className="mr-2" />
            <strong>Name:</strong>{" "}
            {caseData.lawyerDetails.split("_")[0]}
          </li>

          <li className="mb-2">
            <FaUser className="mr-2" />
            <strong>Phone Number:</strong>{" "}
            {caseData.lawyerDetails.split("_")[1]}
          </li>

          <li className="mb-2">
            <FaUser className="mr-2" />
            <strong>Address:</strong>{" "}
            {caseData.lawyerAddress}
          </li>
      </div>

      {!isclient && showtake && (
      <div className="card-footer">
        <Button variant="primary" onClick={handleModalShow}>
          Take Case
        </Button>
      </div>
  )}

  {showclose && (
    <div className="card-footer">
      <Button variant="success" onClick={handleClosecase}>
        Close case
      </Button>
    </div>
)}

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Lawyer Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="lawyerName">
              <Form.Label>Lawyer Name</Form.Label>
              <Form.Control
                type="text"
                name="lawyerName"
                value={userDetails[0]?userDetails[0]:formData.lawyerName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="lawyerPhoneNumber">
              <Form.Label>Lawyer Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="lawyerPhoneNumber"
                value={userDetails[1]?userDetails[1]:formData.lawyerPhoneNumber}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="lawyerAddress">
              <Form.Label>Lawyer Address</Form.Label>
              <Form.Control
                type="text"
                name="lawyerAddress"
                value={userDetails[3]?userDetails[3]:formData.lawyerAddress}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
          <div class="alert alert-primary mt-2" role="alert">
          Are you sure you have Confirmed submitted Documents ?
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleUpdateCase(CaseId)}>
          Take Case
        </Button>
        </Modal.Footer>
      </Modal>



    </div>
  );
}

export default CaseCard;
