import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'; 
import { parsePhoneNumberFromString } from 'libphonenumber-js';


function EditForm({ showModal, handleCloseModal, client_ID }) {
  const [show, setShow] = useState(showModal);
  const [clientData, setClientData] = useState([{}]); // State to store client data
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setShow(showModal);
    if (showModal) {
      // Fetch client data when modal is opened
      fetchClientData();
    }
  }, [showModal,client_ID]);

  const fetchClientData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/getclient/${client_ID}`);
      setClientData(response.data[0]); // Update clientData state with fetched client data
      console.log(clientData);
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    handleCloseModal();
    setValidationErrors({}); // Reset validation errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value
    });
  };

  const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    organization: Yup.string().required("Organization name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string()
    .nullable()
    .test('is-valid-number', 'Invalid mobile number', function (value, context) {
      const { country } = context.parent;
      if (country && value) {
        const phoneNumber = parsePhoneNumberFromString(value, country);
        return phoneNumber ? phoneNumber.isValid() : false;
      }
      return true; // Allow null or undefined values
    })
    .required('Mobile number is required'),
    country: Yup.string().required('Country is required'),
    country: Yup.string().required("Country is required"),
    addressLine: Yup.string()
      .required("Address line 1 is required")
      .matches(alphanumericRegex, "Invalid address"),
    addressLineTwo: Yup.string()
      .required("Address line 2 is required")
      .matches(alphanumericRegex, "Invalid address"),
    timeZone: Yup.string(),
    zipcode: Yup.number().required("Zip code is required"),
    accessLevel: Yup.string().required("Access level is required"),
  });

  const handleSubmit = async () => {
    try {
      // Validate clientData using Yup schema
      await validationSchema.validate(clientData, { abortEarly: false });
  
      // If validation passes, make the API call
      axios.put(`http://localhost:5001/api/v1/getclient/${client_ID}`, clientData)
        .then((res) => {
          handleClose();
          console.log("Done and dusted");
          navigate("/team");
        });
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Yup validation error
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setValidationErrors(errors);
      } else {
        // Other errors
        console.error('Error submitting form:', error);
      }
    }
  };
  

  if (!clientData) {
    return null; // Return null if client data is not yet fetched
  }
  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="clientID">
                  <Form.Label>Client ID</Form.Label>
                  <Form.Control type="text" name="clientID" value={clientData.clientID} readOnly />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="firstname">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" name="firstname" value={clientData.firstname} onChange={handleInputChange} isInvalid={!!validationErrors.firstname}/>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.firstname}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="lastname">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name="lastname" value={clientData.lastname} onChange={handleInputChange} isInvalid={!!validationErrors.lastname}/>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.lastname}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="organization">
                  <Form.Label>Organization</Form.Label>
                  <Form.Control type="text" name="organization" value={clientData.organization} onChange={handleInputChange} isInvalid={!!validationErrors.organization}/>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.organization}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={clientData.email} onChange={handleInputChange} isInvalid={!!validationErrors.email}/>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="mobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control type="text" name="mobile" value={clientData.mobile} onChange={handleInputChange} isInvalid={!!validationErrors.mobile}/>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.mobile}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control type="text" name="country" value={clientData.country} onChange={handleInputChange} isInvalid={!!validationErrors.country}/>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.country}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="addressLine">
                  <Form.Label>Address Line</Form.Label>
                  <Form.Control type="text" name="addressLine" value={clientData.addressLine} onChange={handleInputChange} isInvalid={!!validationErrors.addressLine}/>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.addressLine}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="addressLineTwo">
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control type="text" name="addressLineTwo" value={clientData.addressLineTwo} onChange={handleInputChange} isInvalid={!!validationErrors.addressLineTwo}/>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.addressLineTwo}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="timeZone">
                  <Form.Label>Time Zone</Form.Label>
                  <Form.Select name="timeZone" value={clientData.timeZone} onChange={handleInputChange}>
                    <option value="GMT +5.30">GMT +5.30</option>
                    <option value="CST">CST</option>
                    {/* Add other time zones as needed */}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="zipcode">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control type="text" name="zipcode" value={clientData.zipcode} onChange={handleInputChange} isInvalid={!!validationErrors.zipcode}/>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.zipcode}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="accessLevel">
                  <Form.Label>Access Level</Form.Label>
                  <Form.Select name="accessLevel" value={clientData.accessLevel} onChange={handleInputChange} isInvalid={!!validationErrors.accessLevel}>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="user">User</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.accessLevel}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="activeStatus">
                  <Form.Check type="checkbox" name="activeStatus" label="Active Status" checked={clientData.activeStatus} onChange={(e) => setClientData({ ...clientData, activeStatus: e.target.checked })} />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditForm;
