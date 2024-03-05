import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';

function ClusterRegistration({ showModal, handleCloseModal }) {
  const [show, setShow] = useState(showModal);
  const [ownerID, setOwnerID] = useState("cli002");
  const [ownerType, setOwnerType] = useState("");
  const [validationErrors, setValidationErrors] = useState({});


  const validationSchema = yup.object().shape({
    clustername: yup.string().required('Cluster Name is required'),
    organization: yup.string().required('Organization is required'),
    location: yup.string().required('Location is required'),
  });
  
  const [organization, setOrganization] = useState([]);
  const userType = localStorage.getItem("userType");
  const userID = localStorage.getItem("userID")
  const userOrganization = localStorage.getItem("organization")

  const initialFormData = {
    clusterID: "clu001",
    clustername: "",
    organization: "",
    location: "",
    activeStatus: false,
    cluster_owner_Type: userType,
    cluster_owner_id: userID,
  };

  const [clusterData, setClusterData] = useState(initialFormData);

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


  async function getDevicesCluster() {
    let orgData;
    if (userType === "Client") {
      // If userType is "Client", set the selectedOrg to userOrganization
    
      orgData = [{ organization: userOrganization }];
    } else {
      // If userType is not "Client", fetch organization data from the API
      const response = await axios.get("http://localhost:5001/api/v1/getorg");
      orgData = response.data;
    }
  
    setOrganization(orgData);
  }



  useEffect(() => {
    getDevicesCluster();
    setShow(showModal);
    if (showModal) {
      // Reset clusterData when modal is shown
      determineOwnerType(ownerID);
      setClusterData((prevData) => ({
        ...prevData,
        cluster_owner_Type: ownerType,
        cluster_owner_id: ownerID,
      }));
    }
  }, [showModal, ownerID, ownerType]);

  const handleClose = () => {
    setShow(false);
    handleCloseModal();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    // Clear validation errors for the current input field
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  
    setClusterData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  

  const handleCreateCluster = async () => {
    try {
      // Validate form data
      await validationSchema.validate(clusterData, { abortEarly: false });
  
      // If validation passes, make the API call
      const response = await axios.post(
        "http://localhost:5001/api/v1/cluster",
        clusterData
      );
  
      console.log("Cluster created successfully:", response.data);
      setClusterData(initialFormData);
      handleClose();
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Yup validation error
        const errors = {};
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setValidationErrors(errors);
      } else {
        console.error("Error creating cluster:", error);
      }
    }
  };
  

  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Create Cluster</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="clustername">
                  <Form.Label>Cluster Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="clustername"
                    value={clusterData.clustername}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.clustername}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.clustername}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="organization">
                  <Form.Label>Organization</Form.Label>
                  <Form.Select
                    name="organization"
                    value={clusterData.organization}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.organization}
                  >
                
                  
                    <option value="all">Select Organization</option>
                    {organization.map((org, index) => (
                      <option key={index} value={org.organization}>
                        {org.organization}
                      </option>
                    ))}
                  </Form.Select>
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
                    value={clusterData.location}
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
                    checked={clusterData.activeStatus}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.activeStatus}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.activeStatus}
                  </Form.Control.Feedback>
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

export default ClusterRegistration;
