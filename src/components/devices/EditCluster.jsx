import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';

function EditCluster({ showModal, handleCloseModal, clusterID }) {
  const [show, setShow] = useState(showModal);
  const [clusterData, setClusterData] = useState([{}]); // State to store cluster data
  const [validationErrors, setValidationErrors] = useState({});
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
    setValidationErrors({}); // Reset validation errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClusterData({
      ...clusterData,
      [name]: value,
    });
  };

  const validationSchema = yup.object().shape({
    clustername: yup.string().required('Cluster Name is required'),
    organization: yup.string().required('Organization is required'),
    location: yup.string().required('Location is required'),
    cluster_owner_id: yup.string().required('Owner ID is required'),
  });

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(clusterData, { abortEarly: false });

      const response = await axios.put(
        `http://localhost:5001/api/v1/getcluster/${clusterID}`,
        clusterData
      );
      
      handleClose();
      console.log("Changes saved successfully:", response.data);
      navigate("/cluster");
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = {};
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setValidationErrors(errors);
      } else {
        console.error("Error saving changes:", error);
      }
    }
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
                    readOnly
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
                    value={clusterData.organization}
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
                <Form.Group className="mb-3" controlId="cluster_owner_id">
                  <Form.Label>Owner ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="cluster_owner_id"
                    value={clusterData.cluster_owner_id}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.cluster_owner_id}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.cluster_owner_id}
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
                   
                    onChange={(e) => setClusterData({ ...clusterData, activeStatus: e.target.checked })} 
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
