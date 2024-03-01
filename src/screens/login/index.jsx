import React, { useState , useEffect ,useRef , useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import axios from "../../utils/axios";

const LOGIN_URL ='/auth';

const Login = () => {
  const {setAuth} = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success,setSuccess] = useState(false);
  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

useEffect (() => {
  setError('');
},[username,password])

useEffect (() => {
  userRef.current.focus()
},[])



  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const  response = await axios.post(LOGIN_URL,JSON.stringify({username,password}),{
        headers: {'Content-Type':'application/json'} ,
        withCredentials: true
      });
      console.log(JSON.stringify(response?.data))
      // console.log(JSON.stringify(response))
      // const accessToken = response?.data?.accessToken;
      setUsername('')
      setPassword('')
      setSuccess(true)
      navigate("/dash")
      
    }
    catch{

    }

    }
  

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
    >
      <Typography variant="h4" gutterBottom>
        Aria
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Please enter your username and password
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "300px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            margin="normal"
            autoComplete="off"
            ref={userRef}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginTop: "20px" }}
          >
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
