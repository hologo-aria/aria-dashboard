import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom";

function ClusterRegistration({ showModal, handleCloseModal }) {
  const [show, setShow] = useState(showModal);
  const [ownerID, setOwnerID] = useState("cli002");
  const [ownerType, setOwnerType] = useState("");
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
    setClusterData({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClusterData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateCluster = async () => {
    try {
      console.log(clusterData);
      const response = await axios.post(
        "http://localhost:5001/api/v1/cluster",
        clusterData
      );
      console.log("Cluster created successfully:", response.data);
      setClusterData(initialFormData);
      handleClose();
    } catch (error) {
      console.error("Error creating cluster:", error);
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
                  />
                </Form.Group>
              </div>
              
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="organization">
                  <Form.Label>Organization</Form.Label>
                  <Form.Select
                    name="organization"
                    value={clusterData.organization} onChange={handleInputChange}
                  >
                    <option value="all">Select Organization</option>
                    {organization.map((org, index) => (
                      <option key={index} value={org.organization}>
                        {org.organization}
                      </option>
                    ))}
                  </Form.Select>
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
                    checked={clusterData.activeStatus}
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

export default ClusterRegistration;
