import { FaCheck, FaCalendarAlt, FaUpload, FaUserAlt, FaPhone, FaMapMarkerAlt, FaFileAlt, FaGavel, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { getDatabase, ref as rtdbRef, push, set, get, update } from "firebase/database";
import { database, storage } from "../../firebaseConfig";
import DashboardHeading from "../DashboardHeading";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function AddCaseForm(props) {
  const [formData, setFormData] = useState({
    fullName: props.isclient ? props.userDetails[0] : "",
    currentAddress: props.isclient ? props.userDetails[3] : "",
    phoneNumber: props.isclient ? props.userDetails[1] : "",
    caseTitle: "",
    caseDescription: "",
    caseType: "",
    mutationEntries: null,
    deedOfTitle: null,
    noEncumbranceCertificate: null,
    searchReport: null,
    copyOfFIR: null,
    charsheetWithStatementOfWitnesses: null,
    status: "Submitted",
    lawyerDetails: "",
    lawyerAddress: "",
    paymentStatus: "not_initiated",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Fix: Only update phone number if it's not already set
    if (props.isclient && !formData.phoneNumber) {
      setFormData(prev => ({...prev, phoneNumber: props.userDetails[1]}));
    }
    
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      setIsSubmitting(false);
      return;
    }

    // Use the imported storage directly
    const filesToUpload = [
      "mutationEntries",
      "deedOfTitle",
      "noEncumbranceCertificate",
      "searchReport",
      "charsheetWithStatementOfWitnesses",
    ];

    const fileUrls = [];
    const fileUrlsE = {};

    try {
      await Promise.all(
        filesToUpload.map(async (fieldName) => {
          const files = formData[fieldName];
          if (files) {
            const fileArray = Array.from(files);
            await Promise.all(
              fileArray.map(async (file) => {
                const fileRef = storageRef(
                  storage,
                  `Client-Cases/${file.name}`
                );
                await uploadBytes(fileRef, file);
                const fileUrl = await getDownloadURL(fileRef);
                fileUrlsE[fieldName] = fileUrl;
                fileUrls.push(fileUrl);
              })
            );
          }
        })
      );

      // Update the form data with file URLs
      const updatedFormData = {
        ...formData,
        ...fileUrlsE,
        timestamp: new Date().toISOString(),
        status: "Pending Verification",
      };

      // Generate case ID
      let caseId = "";
      for (let i = 0; i < 10; i++) {
        caseId += Math.floor(Math.random() * 10);
      }
      
      // Store data in Firebase Realtime Database
      try {
        // Use the imported database directly
        const casesRef = rtdbRef(database, "Cases");
        const newCaseRef = push(casesRef);
        
        // Create a data object to store in Firebase
        const caseData = {
          ...updatedFormData,
          caseId: caseId,
          clientId: props.isclient ? props.userDetails[2] : null,
          submittedAt: new Date().toISOString(),
        };
        
        // Save the data to Firebase
        await set(newCaseRef, caseData);
        console.log("Case saved to Firebase Realtime Database");
        toast.success("Case submitted successfully");
        
        // Reset form after successful submission
        setFormData({
          fullName: props.isclient ? props.userDetails[0] : "",
          currentAddress: props.isclient ? props.userDetails[3] : "",
          phoneNumber: props.isclient ? props.userDetails[1] : "",
          caseTitle: "",
          caseDescription: "",
          caseType: "",
          mutationEntries: null,
          deedOfTitle: null,
          noEncumbranceCertificate: null,
          searchReport: null,
          copyOfFIR: null,
          charsheetWithStatementOfWitnesses: null,
          status: "Submitted",
          lawyerDetails: "",
          lawyerAddress: "",
          paymentStatus: "not_initiated",
        });
        
        // Navigate back after successful submission
        window.history.back();
        
      } catch (firebaseError) {
        console.error("Error saving to Firebase:", firebaseError);
        toast.error("Failed to save case to database. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting case:", error);
      toast.error("Failed to submit case. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to fetch cases by client ID
  const fetchCasesByClientId = async (clientId) => {
    try {
      // Use the imported database directly
      const casesRef = rtdbRef(database, "Cases");
      const snapshot = await get(casesRef);
      
      if (snapshot.exists()) {
        const allCases = [];
        snapshot.forEach((childSnapshot) => {
          const caseData = { id: childSnapshot.key, ...childSnapshot.val() };
          if (caseData.clientId === clientId) {
            allCases.push(caseData);
          }
        });
        return allCases;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
      toast.error("Error fetching case data");
      return [];
    }
  };

  // Function to update case status
  const updateCaseStatus = async (caseId, newStatus) => {
    try {
      // Use the imported database directly
      const casesRef = rtdbRef(database, "Cases");
      const snapshot = await get(casesRef);
      
      if (snapshot.exists()) {
        let caseRefToUpdate = null;
        
        snapshot.forEach((childSnapshot) => {
          const caseData = childSnapshot.val();
          if (caseData.caseId === caseId) {
            caseRefToUpdate = rtdbRef(database, `Cases/${childSnapshot.key}`);
          }
        });
        
        if (caseRefToUpdate) {
          await update(caseRefToUpdate, { status: newStatus });
          toast.success("Case status updated successfully");
          return true;
        } else {
          toast.error("Case not found");
          return false;
        }
      } else {
        toast.error("No cases found");
        return false;
      }
    } catch (error) {
      console.error("Error updating case status:", error);
      toast.error("Failed to update case status");
      return false;
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    // You can add code here to fetch data if needed when component mounts
    // For example, if editing an existing case:
    // if (props.editMode && props.caseId) {
    //   fetchCaseDetails(props.caseId);
    // }
  }, [props.userDetails, props.CaseId]);

  return (
    <>
      <div className="container mt-4" style={{ marginBottom: "100px" }}>
        <div className="card" style={{ backgroundColor: "#000", color: "#fff", border: "1px solid #333" }}>
          <div className="card-header" style={{ backgroundColor: "black", color: "white" }}>
            <h4 className="mb-0">Case Submission Form</h4>
          <hr color="white"></hr>
          </div>
          <div className="card-body">
            {/* Progress bar */}
            <div className="progress mb-4" style={{ backgroundColor: "#333", height: "30px" }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ 
                  width: `${step * 33.33}%`, 
                  backgroundColor: "#00b300",
                  height: "30px"
                }} 
                aria-valuenow={step * 33.33} 
                aria-valuemin="0" 
                aria-valuemax="100"
              >
                Step {step} of 3
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="step-content">
                  <h5 className="card-title mb-4" style={{ color: "#fff" }}>
                    <FaUserAlt className="me-2" /> Personal Information
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="fullName" className="form-label" style={{ color: "#fff" }}>
                          <FaUserAlt className="me-2" /> Full Name
                        </label>
                        <input
                          type="text"
                          disabled={props.isclient}
                          className="form-control"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          style={{ backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="phoneNumber" className="form-label" style={{ color: "#fff" }}>
                          <FaPhone className="me-2" /> Phone Number
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phoneNumber"
                          disabled={props.isclient}
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="10-digit phone number"
                          style={{ backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="currentAddress" className="form-label" style={{ color: "#fff" }}>
                      <FaMapMarkerAlt className="me-2" /> Current Address
                    </label>
                    <textarea
                      className="form-control"
                      id="currentAddress"
                      disabled={props.isclient}
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={handleInputChange}
                      rows="3"
                      style={{ backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <button 
                      type="button" 
                      className="btn" 
                      onClick={nextStep}
                      style={{ backgroundColor: "#0077FF", color: "#fff" }}
                    >
                      Next <FaArrowRight className="ms-2" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="step-content">
                  <h5 className="card-title mb-4" style={{ color: "#fff" }}>
                    <FaFileAlt className="me-2" /> Case Details
                  </h5>
                  <div className="form-group mb-3">
                    <label htmlFor="caseTitle" className="form-label" style={{ color: "#fff" }}>
                      <FaFileAlt className="me-2" /> Case Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="caseTitle"
                      name="caseTitle"
                      value={formData.caseTitle}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="caseType" className="form-label" style={{ color: "#fff" }}>
                      <FaGavel className="me-2" /> Case Type
                    </label><br></br>
                    <select
                      className="form-select"
                      id="caseType"
                      name="caseType"
                      value={formData.caseType}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
                      required
                    >
                      <option value="">Select Case Type</option>
                      <option value="Civil">Civil</option>
                      <option value="Criminal">Criminal</option>
                      <option value="Civil suit">Civil Suit</option>
                      <option value="Criminal case">Criminal Case</option>
                      <option value="Civil misc applications">Civil Misc Applications</option>
                      <option value="Criminal misc applications">Criminal Misc Applications</option>
                      <option value="Civil appeal">Civil Appeal</option>
                      <option value="Criminal appeal">Criminal Appeal</option>
                      <option value="Motor accident claim petition(MACP)">Motor Accident Claim Petition (M.A.C.P.)</option>
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="caseDescription" className="form-label" style={{ color: "#fff" }}>
                      <FaFileAlt className="me-2" /> Case Description
                    </label>
                    <textarea
                      className="form-control"
                      id="caseDescription"
                      name="caseDescription"
                      value={formData.caseDescription}
                      onChange={handleInputChange}
                      rows="5"
                      style={{ backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="copyOfFIR" className="form-label" style={{ color: "#fff" }}>
                      <FaFileAlt className="me-2" /> Copy of FIR (ID/Reference Number)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="copyOfFIR"
                      name="copyOfFIR"
                      value={formData.copyOfFIR}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button 
                      type="button" 
                      className="btn" 
                      onClick={prevStep}
                      style={{ backgroundColor: "#333", color: "#fff" }}
                    >
                      <FaArrowLeft className="me-2" /> Previous
                    </button>
                    <button 
                      type="button" 
                      className="btn" 
                      onClick={nextStep}
                      style={{ backgroundColor: "#0077FF", color: "#fff" }}
                    >
                      Next <FaArrowRight className="ms-2" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="step-content">
                  <h5 className="card-title mb-4" style={{ color: "#fff" }}>
                    <FaUpload className="me-2" /> Supporting Documents
                  </h5>
                  <div className="alert" style={{ backgroundColor: "#002244", color: "#fff", border: "1px solid #003366" }}>
                    <i className="fas fa-info-circle me-2"></i>
                    Please upload all relevant documents to support your case. Accepted file formats: PDF, JPG, PNG (Max: 5MB per file)
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="mutationEntries" className="form-label" style={{ color: "#fff" }}>
                          <FaUpload className="me-2" /> Mutation Entries
                        </label>
                        <div className="input-group">
                          <input
                            type="file"
                            className="form-control"
                            id="mutationEntries"
                            name="mutationEntries"
                            onChange={handleFileChange}
                            multiple
                            style={{ backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="deedOfTitle" className="form-label" style={{ color: "#fff" }}>
                          <FaUpload className="me-2" /> Deed of Title
                        </label>
                        <div className="input-group">
                          <input
                            type="file"
                            className="form-control"
                            id="deedOfTitle"
                            name="deedOfTitle"
                            onChange={handleFileChange}
                            multiple
                            style={{ backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="noEncumbranceCertificate" className="form-label" style={{ color: "#fff" }}>
                          <FaUpload className="me-2" /> No Encumbrance Certificate
                        </label>
                        <div className="input-group">
                          <input
                            type="file"
                            className="form-control"
                            id="noEncumbranceCertificate"
                            name="noEncumbranceCertificate"
                            onChange={handleFileChange}
                            multiple
                            style={{ backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="searchReport" className="form-label" style={{ color: "#fff" }}>
                          <FaUpload className="me-2" /> Search Report
                        </label>
                        <div className="input-group">
                          <input
                            type="file"
                            className="form-control"
                            id="searchReport"
                            name="searchReport"
                            onChange={handleFileChange}
                            multiple
                            style={{ backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="charsheetWithStatementOfWitnesses" className="form-label" style={{ color: "#fff" }}>
                      <FaUpload className="me-2" /> Charsheet with Statement of Witnesses
                    </label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        id="charsheetWithStatementOfWitnesses"
                        name="charsheetWithStatementOfWitnesses"
                        onChange={handleFileChange}
                        multiple
                        style={{ backgroundColor: "#222", color: "#fff", border: "1px solid #444" }}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button 
                      type="button" 
                      className="btn" 
                      onClick={prevStep}
                      style={{ backgroundColor: "#333", color: "#fff" }}
                    >
                      <FaArrowLeft className="me-2" /> Previous
                    </button>
                    <button 
                      type="submit" 
                      className="btn" 
                      disabled={isSubmitting}
                      style={{ backgroundColor: "#00b300", color: "#fff" }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaCheck className="me-2" /> Submit Case
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCaseForm;