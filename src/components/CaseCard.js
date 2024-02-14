import { FaFile, FaCalendarAlt, FaUser, FaMapMarkedAlt, FaEnvelope, FaCheck } from 'react-icons/fa';
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getDatabase, ref as rtdbRef, update } from 'firebase/database';
import { app } from '../firebaseConfig';

function CaseCard({ caseData }) {

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    lawyerName: '',
    lawyerPhoneNumber: '',
    lawyerAddress: '',
    acknowledge: '',
  });

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateCase = async () => {
    const dbRealtime = getDatabase(app);
    const casesRef = rtdbRef(dbRealtime, 'Client-Cases');

    // Update the case data with lawyer information and status
    const updatedCaseData = {
      ...caseData,
      lawyerInfo: {
        name: formData.lawyerName,
        phoneNumber: formData.lawyerPhoneNumber,
        address: formData.lawyerAddress,
        acknowledge: formData.acknowledge,
      },
      status: 'Taken',
    };

    await update(rtdbRef(casesRef, caseData.id), updatedCaseData);

    // Close the modal and reset the form data
    handleModalClose();
    setFormData({
      lawyerName: '',
      lawyerPhoneNumber: '',
      lawyerAddress: '',
      acknowledge: '',
    });
  };

  return (
    <div className="card mb-4 shadow-sm">
    <div className="card-header bg-primary text-white">
      <h5 className="mb-0">{caseData.caseTitle}</h5>
    </div>
    <div className="card-body">
      <ul className="list-unstyled mb-0">
        <li className="mb-2">
          <FaUser className="mr-2" />
          <strong>Client Name:</strong> {caseData.firstName} {caseData.middleName} {caseData.lastName}
        </li>
        <li className="mb-2">
          <FaCalendarAlt className="mr-2" />
          <strong>Birth Date:</strong> {caseData.birthDate}
        </li>
        <li className="mb-2">
          <FaMapMarkedAlt className="mr-2" />
          <strong>Location:</strong> {caseData.city}, {caseData.state}, {caseData.country}
        </li>
        <li className="mb-2">
          <FaEnvelope className="mr-2" />
          <strong>Email:</strong> {caseData.email}
        </li>
        <li className="mb-2">
          <FaFile className="mr-2" />
          <strong>Documents:</strong> {caseData.caseDocuments.length} files
        </li>
        <li className="mb-2">
          <FaCheck className="text-success mr-2" />
          <strong>Status:</strong> {caseData.status}
        </li>
        <li className="mb-2">
          <strong>Phone Number:</strong> {caseData.phoneNumber}
        </li>
        <li className="mb-2">
          <strong>Gender:</strong> {caseData.gender}
        </li>
        <li className="mb-2">
          <strong>Age:</strong> {caseData.age}
        </li>
        <li className="mb-2">
          <strong>Persons Involved:</strong> {caseData.personsInvolved}
        </li>
        <li className="mb-2">
          <strong>Case Description:</strong> {caseData.caseDescription}
        </li>
        <li className="mb-2">
          <strong>Case History:</strong> {caseData.caseHistory}
        </li>
        <li className="mb-2">
          <strong>Case Created on:</strong> {caseData.timestamp}
        </li>
      </ul>
    </div>
    <div className="card-footer">
        <Button variant="primary" onClick={handleModalShow}>
          Take Case
        </Button>
      </div>

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
              value={formData.lawyerName}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="lawyerPhoneNumber">
            <Form.Label>Lawyer Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="lawyerPhoneNumber"
              value={formData.lawyerPhoneNumber}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="lawyerAddress">
            <Form.Label>Lawyer Address</Form.Label>
            <Form.Control
              type="text"
              name="lawyerAddress"
              value={formData.lawyerAddress}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="acknowledge">
            <Form.Label>Acknowledge</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="acknowledge"
              value={formData.acknowledge}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdateCase}>
          Take Case
        </Button>
      </Modal.Footer>
    </Modal>

  </div>
  );
}

export default CaseCard;
