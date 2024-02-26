import { Box , useTheme ,Button} from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React ,{useState,useEffect} from 'react'
import { tokens } from "../../theme";
import Header from '../../components/Header';
import { Link } from "react-router-dom";
import { Edit, Delete, Add } from "@mui/icons-material";
import ClusterRegistration from '../../components/devices/ClusterRegistration';
import axios from 'axios';
import EditCluster from '../../components/devices/EditCluster';
import Swal from "sweetalert2";

function Cluster() {
  const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const [cluster , setCluster] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [clusterID,setClusterID] = useState();
    const [showClusterModal, setShowClusterModal] = useState(false);

    const handleShowModal = () => {
     
      setShowModal(true);
    };

    const handleShowClusterModal = (e) => {
     setClusterID(e);
      setShowClusterModal(true);
    };


    const handleCloseModal = () => {
      setShowModal(false);
    };

    const handleCloseClusterModal = () => {
      setShowClusterModal(false);
    };

    useEffect(() => {
      
      const fetchClusters = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5001/api/v1/getcluster"
          );
          setCluster(response.data);
        } catch (error) {
          console.error("Error fetching clusters:", error);
        }
      };
  
      fetchClusters();
    }, [showModal,showClusterModal]);

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
        .delete(`http://localhost:5001/api/v1/getcluster/${e}`)
        .then((res) => {
         console.log("Deletion Success")
         window.location.reload();
        })
    }
  


  const columns = [
    {field:"clusterID",headerName:"Cluster ID",flex:1},
    {field:"clustername",headerName:"Cluster Name",flex:1},
    {field:"location",headerName:"Location",flex:1},

    {field:"organization",headerName:"Organization",flex:1},
    {field:"cluster_owner_Type",headerName:"Owner",flex:1},
    {field:"cluster_owner_id",headerName:"Owner ID",flex:1},
    {field:"no_of_devices",headerName:"No of Devices",flex:1},
    {field:"activeStatus",headerName:"Active Status",flex:1},
    {
      field: "edit",
      headerName: "",
      flex: 1,
      renderCell: ({ row: { clusterID } }) => {
        return (
          <Box
            width="30%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.grey}
            borderRadius="4px"
            onClick={() => handleShowClusterModal(clusterID)}
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
      renderCell: ({ row: { clusterID } }) => {
        return (
          <Box
            width="30%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.grey}
            borderRadius="4px"
            onClick={() => alertMsg(clusterID)}
          >
            <Delete />
            {/* <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography> */}
          </Box>
        );
      },
    },
  ]
  const rows = [
    {
      clusterID : "clu001",
      clustername: "Cluster_Odel_001",
      organization : "Odel",
      cluster_owner_type : "admin",
      cluster_owner_id : "adm001",
      no_of_devices : 20
    }
  ]

  return (
<Box m="20px">
      <Header title="Clusters" subtitle="Managing Clusters" />
      <Box  m="40px 0 0 0"
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
        }} >


          <Box>
         
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
              onClick={()=> handleShowModal()}
            >
              <Add sx={{ mr: "10px" }} />
              Add Clusters
            </Button>
          
        </Box>

        <ClusterRegistration
          showModal={showModal}
          handleCloseModal={handleCloseModal}
        />


        <EditCluster
        showModal={showClusterModal}
        handleCloseModal={handleCloseClusterModal}
        clusterID={clusterID}
        />


      <DataGrid
        getRowId={(row) => row.clusterID}
        rows={cluster}
        columns={columns}
        components={{Toolbar:GridToolbar}} />

      </Box>

     
    </Box>
  )
}

export default Cluster