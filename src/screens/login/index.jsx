import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "../../utils/axios";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { useUser } from "../../context/GlobalProvider";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { updateUser } = useUser();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const userRef = useRef();

  useEffect(() => {
    setError("");
  }, [formData.username, formData.password]);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

     

      const { user, token } = response.data.payload;
      updateUser(user);
      localStorage.setItem("userType" , user.userType )
      localStorage.setItem("userID" , user.id )
      localStorage.setItem("organization" , user.organization )
      localStorage.setItem("auth",true);
      setAuth({ ...formData, accessToken: token, userRole: user.userType });


      navigate("/dash", { replace: true });
    } catch (err) {
      if (!err.response) {
        setError("No Server Response");
      } else if (err.response.status === 400) {
        setError("Missing Username or Password");
      } else if (err.response.status === 401) {
        setError("Unauthorized");
      } else {
        setError("Login Failed");
      }
    }
  };

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
            name="username"
            value={formData.username}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            autoComplete="off"
            ref={userRef}
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
