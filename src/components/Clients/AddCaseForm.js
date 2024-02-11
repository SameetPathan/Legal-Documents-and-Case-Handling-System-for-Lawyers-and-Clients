import { FaFile, FaCheck, FaCalendarAlt } from 'react-icons/fa';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as rtdbRef, push } from 'firebase/database';
import { app } from '../../firebaseConfig';
import DashboardHeading from '../DashboardHeading';
import { useState } from 'react';
import { toast } from 'react-toastify';


function AddCaseForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    birthDate: '',
    state: '',
    city: '',
    country: '',
    gender: '',
    age: '',
    caseDescription: '',
    caseTitle: '',
    personsInvolved: '',
    caseHistory: '',
    uploadedFiles: null,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      uploadedFiles: e.target.files,
    });
  };

  const handleDateChange = (e) => {
    setFormData({
      ...formData,
      birthDate: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    const db = getFirestore(app);
    const casesCollection = collection(db, 'your_collection_name');

    const caseData = {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      birthDate: formData.birthDate,
      state: formData.state,
      city: formData.city,
      country: formData.country,
      gender: formData.gender,
      age: formData.age,
      caseDescription: formData.caseDescription,
      caseTitle: formData.caseTitle,
      personsInvolved: formData.personsInvolved,
      caseHistory: formData.caseHistory,
      status: 'Pending Verification',
      timestamp: new Date().toISOString(),
    };

    const caseRef = await addDoc(casesCollection, caseData);
    const storage = getStorage(app);
    const files = Array.from(formData.uploadedFiles);

    const filePromises = files.map(async (file) => {
      const fileRef = ref(storage, `cases/${caseRef.id}/${file.name}`);
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    });

    const fileUrls = await Promise.all(filePromises);
    const dbRealtime = getDatabase(app);
    const imagePathsRef = rtdbRef(dbRealtime, `cases/${caseRef.id}/imagePaths`);

    fileUrls.forEach((url) => {
      push(imagePathsRef, url);
    });

    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      birthDate: '',
      state: '',
      city: '',
      country: '',
      gender: '',
      age: '',
      caseDescription: '',
      caseTitle: '',
      personsInvolved: '',
      caseHistory: '',
      uploadedFiles: null,
    });
   toast.success("Case submitted successfully!")
   
  };

  return (
    <>
      <DashboardHeading text={"Add Case"}></DashboardHeading>
      <div className="container mt-4" style={{marginBottom:"100px"}}>
        <form onSubmit={handleSubmit}>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="middleName">Middle Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="birthDate">Birth Date</label>
                <div className="input-group">
                  <input
                    type="date"
                    className="form-control"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleDateChange}
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">
                      <FaCalendarAlt />
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  className="form-control"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  className="form-control"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  className="form-control"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="caseDescription">Case Description</label>
            <textarea
              className="form-control"
              id="caseDescription"
              name="caseDescription"
              value={formData.caseDescription}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="caseTitle">Case Title</label>
            <input
              type="text"
              className="form-control"
              id="caseTitle"
              name="caseTitle"
              value={formData.caseTitle}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="personsInvolved">Persons Involved</label>
            <input
              type="text"
              className="form-control"
              id="personsInvolved"
              name="personsInvolved"
              value={formData.personsInvolved}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="caseHistory">Case History</label>
            <textarea
              className="form-control"
              id="caseHistory"
              name="caseHistory"
              value={formData.caseHistory}
              onChange={handleInputChange}
            />
          </div>

        
          <div className="form-group">
            <label htmlFor="uploadedFiles">Upload Documents (ZIP format)</label>
            <input
              type="file"
              className="form-control-file"
              id="uploadedFiles"
              name="uploadedFiles"
              accept=".zip"
              onChange={handleFileChange}
              multiple
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
          <FaCheck className="mr-2" />
          Submit Case
        </button>
        </form>
      </div>
    </>
  );
}

export default AddCaseForm;
