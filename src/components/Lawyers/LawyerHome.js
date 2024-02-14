// Import necessary libraries
import React from 'react';
import { FaEye, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import DashboardHeading from '../DashboardHeading';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

// Define the LawyerHome component
function LawyerHome() {
  return (
    <>
    <DashboardHeading text={"Welcome to Lawyer Home"}></DashboardHeading>
    <div className="container mt-4">

      {/* Options to view client cases, see picked cases, and check payment status */}
      <div className="card-deck">
        {/* View Client Cases */}
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">View Client Cases <br></br><br></br></h5>
            <p className="card-text">Click below to view cases of al clients<br></br><br></br></p>

            <Link to="/lawyer-case-view" className="btn btn-primary">
            <FaEye className="mr-2" />
            View Cases
          </Link>

           
          </div>
        </div>

        {/* See Picked Cases */}
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">See Picked Cases<br></br><br></br></h5>
            <p className="card-text">Click below to see the cases you have picked</p>
            <button className="btn btn-success">
              <FaClipboardList className="mr-2" />
              Picked Cases
            </button>
          </div>
        </div>

        {/* Payment Status of Completed Cases */}
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Payment Status of Completed Cases</h5>
            <p className="card-text">Click below to check the payment status of completed cases</p>
            <button className="btn btn-info">
              <FaMoneyBillWave className="mr-2" />
              Payment Status
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default LawyerHome;
