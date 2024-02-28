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

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [organization, setOrganization] = useState([]);

  async function getDevicesCluster() {
    axios
    .get(`http://localhost:5001/api/v1/getorg`)
    .then((res) => {
      setOrganization(res.data);
      console.log(organization);
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

  useEffect(() => {
    getDevicesCluster();
  }, []);



  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" />

        <Box>
          {/* <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button> */}
        </Box>
      </Box>
      <Box className="card-container" >
        <div style={{width:"18rem"}}>
          <Form.Group className="mb-3" controlId="clientname">
            {/* <Form.Label>Cluster Name</Form.Label> */}
            <Form.Select
              name="clientname"
              // value={deviceData.clustername} onChange={handleInputChange}
            >
              <option value="all">Select Client</option>
              {organization.map((org, index) => (
                      <option key={index} value={org.organization}>
                        {org.organization}
                      </option>
                    ))}
            </Form.Select>
          </Form.Group>
        </div>
        {/* <div style={{width:"18rem"}}>
          <Form.Group className="mb-3" controlId="organization">
            <Form.Label>Cluster Name</Form.Label>
            <Form.Select
              name="organization"
              value={deviceData.clustername} onChange={handleInputChange}
            >
              <option value="">Select Organization</option>
              {clusterName.map((cluster, index) => (
                      <option key={index} value={cluster.clustername}>
                        {cluster.clustername}
                      </option>
                    ))}
            </Form.Select>
          </Form.Group>
        </div> */}
      </Box>
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
            <p className="card-font-style">34</p>
            <div className="card-body-style">
              <div className="active">Active 32</div>
              <div className="inactive">InActive 2</div>
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
            <p className="card-font-style">6</p>
            <div className="card-body-style">
              <div className="active">Active 4</div>
              <div className="inactive">InActive 2</div>
            </div>
          </Card.Body>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
