import React, { useState, useEffect } from "react";

import { Box, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Delete, Add } from "@mui/icons-material";
import DeviceRegistration from "../../components/devices/DeviceRegistration";
import axios from "axios";
import Swal from "sweetalert2";
import EditDevice from "./../../components/devices/EditDevice"


function Devices() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [device, setDevice] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deviceID, setDeviceID] = useState();
  const [showdeviceModal, setShowDeviceModal] = useState(false);

  const userType = localStorage.getItem("userType");
  const userID = localStorage.getItem("userID")
  const userOrganization = localStorage.getItem("organization")

  const navigate = useNavigate()

  const auth = localStorage.getItem("auth");

  if (!auth){
navigate("/") 
 }

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleShowDeviceModal = (e) => {
    setDeviceID(e);
    setShowDeviceModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseDeviceModal = () => {
    setShowDeviceModal(false);
  };


  const fetchDevices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/v1/getdevice"
      );
      setDevice(response.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };


  const fetchClientDevices = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/getdevice/dash/${userOrganization}`)

      setDevice(response.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };


  useEffect(() => {
   
    if(userType != "Admin")
    {
      fetchClientDevices()
    }
    else {

      fetchDevices();
    }

  }, [showModal, showdeviceModal]);




  const alertMsg = (clustername, deviceID) => {
    console.log(device[0].clustername);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F99417",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData(clustername, deviceID);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const deleteData = (clustername, deviceID) => {
    axios.delete(`http://localhost:5001/api/v1/getDevice/${clustername}/${deviceID}`).then((res) => {
      console.log("Deletion Success");
      window.location.reload();
    });
  };

  const columns = [
    { field: "deviceID", headerName: "Device ID", flex: 1 },
    { field: "devicename", headerName: "Device Name", flex: 1 },
    { field:"mac_address" , headerName:"Mac address" },
    { field:"clustername", headerName:"Cluster Name" , flex:1},
    { field: "location", headerName: "Location", flex: 1 },

    { field: "organization", headerName: "Organization", flex: 1 },
    { field: "deivce_owner_Type", headerName: " Owner", flex: 1 },
    { field: "clusterActiveStatus", headerName: "Cluster Active Status", flex: 1 },
    { field: "activeStatus", headerName: "Active Status", flex: 1 },
    {
      field: "edit",
      headerName: "",
      flex: 1,
      renderCell: ({ row: { deviceID } }) => {
        return (
          <Box
            width="30%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.grey}
            borderRadius="4px"
            onClick={() => handleShowDeviceModal(deviceID)}
          >
            <Edit />
            {/* <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography> */}
          </Box>
        );
      },
    },
    {
      field: "delete",
      headerName: "",
      flex: 1,
      renderCell: ({ row: { deviceID } }) => {
        return (
          <Box
            width="30%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.grey}
            borderRadius="4px"
            onClick={() => alertMsg( device[0].clustername ,deviceID)}
          >
            <Delete />
            {/* <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography> */}
          </Box>
        );
      },
    },
  ];
 

  return (
    <Box m="20px">
      <Header title="Devices" subtitle="Managing Devices" />
      <Box
        m="40px 0 0 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={() => handleShowModal()}
          >
            <Add sx={{ mr: "10px" }} />
            Add Devices
          </Button>
        </Box>

        <DeviceRegistration
          showModal={showModal}
          handleCloseModal={handleCloseModal}
        />

        <EditDevice
        showModal={showdeviceModal}
        handleCloseModal={handleCloseDeviceModal}
        deviceID={deviceID}
        />
        
        <DataGrid
          getRowId={(row) => row.deviceID}
          rows={device}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
}

export default Devices;
