import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom';


function EditForm({ showModal, handleCloseModal, adminID }) {
  const [show, setShow] = useState(showModal);
  const [adminData, setAdminData] = useState([{}]); // State to store client data
  const navigate = useNavigate();

  useEffect(() => {
    setShow(showModal);
    if (showModal) {
      // Fetch client data when modal is opened
      fetchAdminData();
    }
  }, [showModal,adminID]);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/getadmin/${adminID}`);
      setAdminData(response.data[0]); // Update adminData state with fetched client data
      console.log(adminData);
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    handleCloseModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData({
      ...adminData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    
    axios
      .put(`http://localhost:5001/api/v1/getadmin/${adminID}`, adminData)
      .then((res) => {
        handleClose();
        console.log("Done and dusted");
         navigate("/admin");
         

      });
  };

  if (!adminData) {
    return null; // Return null if client data is not yet fetched
  }
  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Edit Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="clientID">
                  <Form.Label>Admin ID</Form.Label>
                  <Form.Control type="text" name="clientID" value={adminData.adminID} readOnly />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="firstname">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" name="firstname" value={adminData.firstname} onChange={handleInputChange} />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="lastname">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name="lastname" value={adminData.lastname} onChange={handleInputChange} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="organization">
                  <Form.Label>Organization</Form.Label>
                  <Form.Control type="text" name="organization" value={adminData.organization} onChange={handleInputChange} />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={adminData.email} onChange={handleInputChange} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="mobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control type="text" name="mobile" value={adminData.mobile} onChange={handleInputChange} />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control type="text" name="country" value={adminData.country} onChange={handleInputChange} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="addressLine">
                  <Form.Label>Address Line</Form.Label>
                  <Form.Control type="text" name="addressLine" value={adminData.addressLine} onChange={handleInputChange} />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="addressLineTwo">
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control type="text" name="addressLineTwo" value={adminData.addressLineTwo} onChange={handleInputChange} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="timeZone">
                  <Form.Label>Time Zone</Form.Label>
                  <Form.Select name="timeZone" value={adminData.timeZone} onChange={handleInputChange}>
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
                  <Form.Control type="text" name="zipcode" value={adminData.zipcode} onChange={handleInputChange} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="accessLevel">
                  <Form.Label>Access Level</Form.Label>
                  <Form.Select name="accessLevel" value={adminData.accessLevel} onChange={handleInputChange}>
                    
                  <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="user">User</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="activeStatus">
                  <Form.Check type="checkbox" name="activeStatus" label="Active Status" checked={adminData.activeStatus} onChange={(e) => setAdminData({ ...adminData, activeStatus: e.target.checked })} />
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
