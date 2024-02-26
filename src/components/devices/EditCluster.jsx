import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom";

function EditCluster({ showModal, handleCloseModal, clusterID }) {
  const [show, setShow] = useState(showModal);
  const [clusterData, setClusterData] = useState([{}]); // State to store cluster data
  const navigate = useNavigate();

  useEffect(() => {
    setShow(showModal);
    if (showModal) {
      // Fetch cluster data when modal is opened
      fetchClusterData();
    }
  }, [showModal, clusterID]);

  const fetchClusterData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/getcluster/${clusterID}`
      );
      setClusterData(response.data[0]); // Update clusterData state with fetched cluster data
      console.log(clusterData);
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
    setClusterData({
      ...clusterData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    axios
      .put(`http://localhost:5001/api/v1/getcluster/${clusterID}`, clusterData)
      .then((res) => {
        handleClose();
        console.log("Done and dusted");
        navigate("/cluster");
      });
  };

  if (!clusterData) {
    return null; // Return null if cluster data is not yet fetched
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Edit Cluster</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="clusterID">
                  <Form.Label>Cluster ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="clusterID"
                    value={clusterData.clusterID}
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
                    value={clusterData.clustername}
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
                    value={clusterData.organization}
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
                    value={clusterData.location}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="cluster_owner_id">
                  <Form.Label>Owner ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="cluster_owner_id"
                    value={clusterData.cluster_owner_id}
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
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditCluster;
