import React from 'react'
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';

function EditDevice({ showModal, handleCloseModal, deviceID }) {
  const [show, setShow] = useState(showModal);
  const [deviceData, setDeviceData] = useState([{}]); // State to store cluster data
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});



  useEffect(() => {
    setShow(showModal);
    if (showModal) {
      // Fetch cluster data when modal is opened
      fetchDeviceData();
    }
  }, [showModal, deviceID]);


  const fetchDeviceData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/getdevice/${deviceID}`
      );
      setDeviceData(response.data[0]); // Update deviceData state with fetched cluster data
      console.log(deviceData);
    } catch (error) {
      console.error("Error fetching cluster data:", error);
    }
  };

  const handleClose = () => {
    setShow(false);
    handleCloseModal();
    setValidationErrors({}); // Reset validation errors
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeviceData({
      ...deviceData,
      [name]: value,
    });
  };

  const validationSchema = yup.object().shape({
    devicename: yup.string().required('Device Name is required'),
    clustername: yup.string().required('Cluster Name is required'),
    organization: yup.string().required('Organization is required'),
    mac_address: yup.string().required('MAC Address is required'),
    location: yup.string().required('Location is required'),
  });

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(deviceData, { abortEarly: false });

      const response = await axios.put(`http://localhost:5001/api/v1/getdevice/${deviceID}`, deviceData);
      console.log('Device updated successfully:', response.data);

      handleClose();
      navigate('/devices');
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = {};
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setValidationErrors(errors);
      } else {
        console.error('Error updating Device:', error);
      }
    }
  };

  if (!deviceData) {
    return null; // Return null if cluster data is not yet fetched
  }

// Device ID , Deivce Name , MacAddress , Cluster name , Organization , Location , Active Status

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Edit Device</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="deviceID">
                  <Form.Label>Device ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="deviceID"
                    value={deviceData.deviceID}
                    onChange={handleInputChange}
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="devicename">
                  <Form.Label>Device Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="devicename"
                    value={deviceData.devicename}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.devicename}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.devicename}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="mac_address">
                  <Form.Label>Mac Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="mac_address"
                    value={deviceData.mac_address}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.mac_address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.mac_address}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="clustername">
                  <Form.Label>Cluster Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="clustername"
                    value={deviceData.clustername}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.clustername}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.clustername}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="organization">
                  <Form.Label>Organization</Form.Label>
                  <Form.Control
                    type="text"
                    name="organization"
                    value={deviceData.organization}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.organization}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.organization}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={deviceData.location}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.location}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.location}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="activeStatus">
                  <Form.Check
                    type="checkbox"
                    name="activeStatus"
                    label="Active Status"
                    checked={deviceData.activeStatus}
                    onChange={(e) => setDeviceData({ ...deviceData, activeStatus: e.target.checked })} 
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" 
          onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default EditDevice;