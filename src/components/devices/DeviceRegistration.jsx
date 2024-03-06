import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';

function DeviceRegistration({ showModal, handleCloseModal }) {
  const [show, setShow] = useState(showModal);
  const [ownerID, setOwnerID] = useState("cli001");
  const [ownerType, setOwnerType] = useState("");
  const [clusterName, setClusterName] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});



  const initialFormData = {
    devicename: "",
    clustername: "",
    organization: "",
    mac_address: "",
    activeStatus: false,
    location: "",
    deivce_owner_Type: ownerType,
    deivce_owner_id: ownerID,
  };


  const [deviceData, setDeviceData] = useState(initialFormData);

  const navigate = useNavigate();

  const determineOwnerType = (id) => {
    if (id.startsWith("cli")) {
      setOwnerType("Client");
    } else if (id.startsWith("adm")) {
      setOwnerType("Admin");
    } else {
      setOwnerType("");
    }
  };

  async function getDetails() {
    axios
      .get(`http://localhost:5001/api/v1/getcluster/owner/${ownerID}`)
      .then((res) => {
        setClusterName(res.data);
        console.log(clusterName);
        // setUser(res.data[0]);
        // console.log(res.data[0].city);
        // axios
        //   .get(
        //     `http://localhost:5000/api/v1/destinationFilter/${res.data[0].city}`
        //   )
        //   .then((res) => {
        //     setDealer(res.data);
        //     console.log(res.data);
        //     localStorage.setItem("count", res.data.length);
        //   });
      });
  }

  // useEffect(() => {
  //   getDetails();
  // }, []);

  useEffect(() => {
    getDetails();
    setShow(showModal);
    if (showModal) {
      // Reset deviceData when modal is shown
      determineOwnerType(ownerID);
      setDeviceData((prevData) => ({
        ...prevData,
        deivce_owner_Type: ownerType,
        deivce_owner_id: ownerID,
      }));
    }
  }, [showModal, ownerID, ownerType]);

  const handleClose = () => {
    setShow(false);
    handleCloseModal();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDeviceData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validationSchema = yup.object().shape({
    devicename: yup.string().required('Device Name is required'),
    clustername: yup.string().required('Cluster Name is required'),
    organization: yup.string().required('Organization is required'),
    mac_address: yup.string().required('MAC Address is required'),
    location: yup.string().required('Location is required'),
  });

  const handleCreateCluster = async () => {
    console.log(deviceData);
    try {
      await validationSchema.validate(deviceData, { abortEarly: false });

      const response = await axios.post("http://localhost:5001/api/v1/device", deviceData);
      console.log("Device created successfully:", response.data);

      setDeviceData(initialFormData);
      handleClose();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = {};
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setValidationErrors(errors);
      } else {
        console.error("Error creating Device:", error);
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Create Device</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
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
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="clustername">
                  <Form.Label>Cluster Name</Form.Label>
                  <Form.Select name="clustername" value={deviceData.clustername} onChange={handleInputChange} isInvalid={!!validationErrors.clustername}>
                    <option value="">Select Cluster</option>
                    {clusterName.map((cluster, index) => (
                      <option key={index} value={cluster.clustername}>
                        {cluster.clustername}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.clustername}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
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
            </div>
            <div className="row">
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
          <Button variant="primary" onClick={handleCreateCluster}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeviceRegistration;
