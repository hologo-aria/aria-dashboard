import React from 'react'
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom";

function EditDevice({ showModal, handleCloseModal, deviceID }) {
  const [show, setShow] = useState(showModal);
  const [deviceData, setDeviceData] = useState([{}]); // State to store cluster data
  const navigate = useNavigate();



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
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeviceData({
      ...deviceData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    axios
      .put(`http://localhost:5001/api/v1/getdevice/${deviceID}`, deviceData)
      .then((res) => {
        handleClose();
        console.log("Done and dusted");
        navigate("/devices");
      });
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
                  />
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
                  />
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
                  />
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
                  />
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
                  />
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
                    onChange={handleInputChange}
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