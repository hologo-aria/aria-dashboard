import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { Edit, Delete, Add } from "@mui/icons-material";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import EditForm from "../../components/admin/EditForm";
import Swal from "sweetalert2";

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [adminID, setadminID] = useState("");
  const handleShowModal = (e) => {
    setadminID(e);
    setShowModal(true);
  };


  const alertMsg = (e) =>{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F99417",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData(e);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }

  const deleteData = (e) =>{
    axios
      .delete(`http://localhost:5001/api/v1/getadmin/${e}`)
      .then((res) => {
       console.log("Deletion Success")
       window.location.reload();
      })
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    // Fetch client data from the backend when the component mounts
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/v1/getadmin"
        );
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, [showModal]);

  const columns = [
    { field: "adminID", headerName: "Admin ID", flex: 1 },
    { field: "firstname", headerName: "First Name", flex: 1 },
    { field: "organization", headerName: "Organization", flex: 1 },
    { field: "mobile", headerName: "Mobile", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    {
      field: "activeStatus",
      headerName: "Status",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { accessLevel } }) => {
        return (
          <Box
            width="90%"
            m="0 auto"
            p="10px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              accessLevel === "admin"
                ? colors.greenAccent[600]
                : accessLevel === "moderator"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {accessLevel === "superadmin" && <AdminPanelSettingsOutlinedIcon />}
            {accessLevel === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {accessLevel === "moderator" && <SecurityOutlinedIcon />}
            {accessLevel === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {accessLevel}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "edit",
      headerName: "",
      flex: 1,
      renderCell: ({ row: { adminID } }) => {
        return (
          <Box
            width="30%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.grey}
            borderRadius="4px"
            onClick={() => handleShowModal(adminID)}
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
      renderCell: ({ row: { adminID } }) => {
        return (
          <Box
            width="30%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.grey}
            borderRadius="4px"
            onClick={() => alertMsg(adminID)}
          >
            <Delete />

          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Admin" subtitle="Managing the Admins" />
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
          <Link to="/admin/reg">
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <Add sx={{ mr: "10px" }} />
              Add Admins
            </Button>
          </Link>
        </Box>
        <EditForm
          showModal={showModal}
          handleCloseModal={handleCloseModal}
         adminID={adminID}
          email="example@example.com"
          textareaValue="Some text here"
        />
        <DataGrid
          getRowId={(row) => row.adminID}
          rows={admins}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Admin;
