import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import "./../../assets/css/dashboard.css";
import { useEffect, useState } from "react";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import GridViewIcon from "@mui/icons-material/GridView";
import axios from "axios";
import Header from "../../components/Header";
import { useUser } from "../../context/GlobalProvider";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [organization, setOrganization] = useState([]);
  const [selectOrg , setSelectOrg] = useState("");
  const [clusterData,setClusterData] = useState([]);
  const [deviceData,setDeviceData] = useState([]);
  const [deviceCount , setDeviceCount] = useState(0);
  const [clusterCount , setClusterCount] = useState(0);
  const [activeDevices , setActiveDevices ] = useState(0);
  const [activeCluster , setActiveClusters ] = useState(0);

  const {userData} = useUser() ;
  console.log(userData.id)

  const userType = localStorage.getItem("userType");
  const userID = localStorage.getItem("userID")
  const userOrganization = localStorage.getItem("organization")

  async function getDevicesCluster() {
    axios.all([
      axios.get(`http://localhost:5001/api/v1/getorg`),
      axios.get(`http://localhost:5001/api/v1/getdevice`),
      axios.get(`http://localhost:5001/api/v1/getcluster`)
    ])
   
    .then(axios.spread((orgResponce,devicesRes,clusterRes) => {
      setOrganization(orgResponce.data);
  
      setClusterData(clusterRes.data);
      console.log(clusterData);
  
      setDeviceData(devicesRes.data);
      console.log(deviceData);
      setDeviceCount(devicesRes.data.length);
      setClusterCount(clusterRes.data.length);
      setActiveDevices(devicesRes.data.filter(device => device.activeStatus).length);
      setActiveClusters(clusterRes.data.filter(cluster => cluster.activeStatus).length);
    
    }))
  }



  async function getSpecificOrgDevicesClusters() {

    
    axios.all([
      axios.get(`http://localhost:5001/api/v1/getcluster/dash/${userOrganization}`),
      axios.get(`http://localhost:5001/api/v1/getdevice/dash/${userOrganization}`)
    ])
    .then(axios.spread((clusterRes, devicesRes) => {

      setClusterData(clusterRes.data);
      console.log(clusterData);

      setDeviceData(devicesRes.data);
      console.log(deviceData);
      setDeviceCount(devicesRes.data.length);
      setClusterCount(clusterRes.data.length);
      setActiveDevices(devicesRes.data.filter(device => device.activeStatus).length);
      setActiveClusters(clusterRes.data.filter(cluster => cluster.activeStatus).length);

    }))
    .catch(error => {
      
      console.error("Error:", error);
    });
  }


  

  useEffect(() => {
   
    if (userType != "Admin"){
      getSpecificOrgDevicesClusters()
    }
    else {
      getDevicesCluster();
    }
  }, []);


  const handleInputChange = (e) => {
    setSelectOrg(e.target.value); 
    
    if(e.target.value != "all") {
      axios.all([
        axios.get(`http://localhost:5001/api/v1/getcluster/dash/${e.target.value}`),
        axios.get(`http://localhost:5001/api/v1/getdevice/dash/${e.target.value}`)
      ])
      .then(axios.spread((clusterRes, devicesRes) => {
  
        setClusterData(clusterRes.data);
        console.log(clusterData);
 
        setDeviceData(devicesRes.data);
        console.log(deviceData);
        setDeviceCount(devicesRes.data.length);
        setClusterCount(clusterRes.data.length);
        setActiveDevices(devicesRes.data.filter(device => device.activeStatus).length);
        setActiveClusters(clusterRes.data.filter(cluster => cluster.activeStatus).length);
  
      }))
      .catch(error => {
        
        console.error("Error:", error);
      });
    }
    else{
      getDevicesCluster()
    }

    
  };



  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" />

    
      </Box>
      {userType === "Client" ? null : (
        <Box className="card-container">
          <div style={{ width: "18rem" }}>
            <Form.Group className="mb-3" controlId="clientname">
              <Form.Label>Select Client</Form.Label>
              <Form.Select name="clientname" value={selectOrg} onChange={handleInputChange}>
                <option value="all">All</option>
                {organization.map((org, index) => (
                  <option key={index} value={org.organization}>
                    {org.organization}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        </Box>
      )}
      <Box className="card-container">
        <Card style={{ width: "18rem" }}>
          <Card.Header className="card-header">
            <div className="header">Devices</div>
            <div className="icon">
              {" "}
              <SmartphoneIcon fontSize="large" />{" "}
            </div>
          </Card.Header>
          <Card.Body>
            <p className="card-font-style">{deviceCount}</p>
            <div className="card-body-style">
              <div className="active">Active {activeDevices}</div>
              <div className="inactive">InActive {deviceCount-activeDevices}</div>
            </div>
          </Card.Body>
        </Card>
        <Card style={{ width: "18rem" }}>
          <Card.Header className="card-header">
            <div className="header">Clusters</div>
            <div className="icon">
              {" "}
              <GridViewIcon fontSize="large" />{" "}
            </div>
          </Card.Header>
          <Card.Body>
            <p className="card-font-style">{clusterCount}</p>
            <div className="card-body-style">
              <div className="active">Active {activeCluster}</div>
              <div className="inactive">InActive {clusterCount - activeCluster}</div>
            </div>
          </Card.Body>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
