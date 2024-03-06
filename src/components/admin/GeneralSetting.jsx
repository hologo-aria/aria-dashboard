import React, { useState ,useEffect } from "react";
import { Col, Row, Form, Card } from "react-bootstrap";
import FormSelect from "../../widgets/form-select/FormSelect";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import * as Yup from 'yup';
import { parsePhoneNumberFromString } from 'libphonenumber-js';


import "./../../assets/css/generalSetting.css";

const GeneralSetting = () => {
  const [showGeneralForm, setShowGeneralForm] = useState(true);
  const [adminId, setAdminId] = useState("adm001");
  const [countryData, setCountryData] = useState();
  const [formErrors, setFormErrors] = useState({});



  const [cliID, setCliID] = useState("cli001");
  
  const alphanumericRegex = /^[a-zA-Z0-9\s.,#\/-]+$/;

  const generalInfoSchema = Yup.object().shape({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    organization: Yup.string().required("Organization name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string()
    .nullable()
    .test('is-valid-number', 'Invalid mobile number', function (value, context) {
      const { country } = context.parent;
      if (country && value) {
        const phoneNumber = parsePhoneNumberFromString(value, country);
        return phoneNumber ? phoneNumber.isValid() : false;
      }
      return true; // Allow null or undefined values
    })
    .required('Mobile number is required'),
    country: Yup.string().required('Country is required'),
    addressLine: Yup.string()
      .required("Address line 1 is required")
      .matches(alphanumericRegex, "Invalid address"),
    addressLineTwo: Yup.string()
      .required("Address line 2 is required")
      .matches(alphanumericRegex, "Invalid address"),
    timeZone: Yup.string(),
    zipcode: Yup.number().required("Zip code is required"),
    
  });
  
  const loginCredentialsSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\s])[A-Za-z\d@$!%*?&\s]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmpassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    accessLevel: Yup.string().required("Access level is required"),
  });
  
  useEffect(() => {
    var date = new Date();
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1; // Months are zero-indexed
    var day = date.getUTCDate();
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    var milliseconds = date.getUTCMilliseconds();
    
    // Create a UTC timestamp from the individual components
    var utcTimestamp = Date.UTC(year, month, day, hours, minutes, seconds, milliseconds);
    setCliID("CLI"+ utcTimestamp)
  }, [cliID]);



  const fetchData = async () => {
    try {
      const countries = await axios.get("https://restcountries.com/v3.1/all");
      setCountryData(countries.data);
      console.log(countryData)
    } catch (err) {
      console.log(err);
    }
  };





  const navigate = useNavigate();
  const initialFormData = {
    adminID: adminId,
    firstname: "",
    lastname: "",
    organization: "",
    email: "",
    mobile: "",
    country: "",
    addressLine: "",
    addressLineTwo: "",
    timeZone: "",
    zipcode: "",
    username: "",
    password: "",
    confirmpassword: "",
    accessLevel: "",
    activeStatus: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  const countryOptions = [
    { value: "India", label: "India" },
    { value: "US", label: "US" },
    { value: "UK", label: "UK" },
    { value: "UAE", label: "UAE" },
    { value: "SL", label: "Sri Lanka" },
    { value: "Maldives", label: "Maldives" },
  ];

  const accessLevelOptions = [
    { value: "superadmin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "moderator", label: "Moderator" },
    { value: "user", label: "User" },
  ];

  const timeZoneOptions = [
    { value: "GMT +5.30", label: "GMT +5.30" },
    { value: "GMT +5.30", label: "GMT +5.30" },
    { value: "GMT +5.30", label: "GMT +5.30" },
    { value: "GMT +5.30", label: "GMT +5.30" },
  ];

  const handleChange = (e) => {
  const { id, value } = e.target;

  setFormErrors((prevErrors) => ({
    ...prevErrors,
    [id]: undefined,
  }));

  setFormData((prevData) => ({
    ...prevData,
    [id]: value,
  }));
};

  const handleNextClick = async (e) => {
    e.preventDefault();
    try {
      await generalInfoSchema.validate(formData, { abortEarly: false });
      setShowGeneralForm(false);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // Handle Yup validation errors
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        console.error("Validation errors:", errors);
        // Set the errors to the state
        setFormErrors(errors);
      } else {
        console.error("Error creating Admin:", error);
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginCredentialsSchema.validate(formData, { abortEarly: false });
      await handleSubmit(e);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // Handle Yup validation errors
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        console.error("Validation errors:", errors);
        // Set the errors to the state
        setFormErrors(errors);
      } else {
        console.error("Error creating Admin:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:5001/api/v1/admin",
      formData
    );
    console.log("Admin created:", response.data);
    setFormData(initialFormData);
    navigate("/admin");
  } catch (error) {
    console.error("Error creating Admin:", error);
    }
  };
  

  return (
    <div className="form-container">
       <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/admin">
          Admin
        </Link>
       
        <Typography color="text.primary">Form</Typography>
      </Breadcrumbs>
      
      {showGeneralForm && (
        <Form className="card-body" onSubmit={handleSubmit}>
          <Row className="mb-8">
            <Col xl={3} lg={4} md={12} xs={12}>
              <div className="mb-4 mb-lg-0">
                <h4 className="mb-1">General Information</h4>
              </div>
            </Col>
            <Col xl={9} lg={8} md={12} xs={12}>
              <Card>
                <Card.Body>
                  <div className="card-body">
                    <Row className="mb-3">
                      <label
                        htmlFor="firstname"
                        className="col-sm-4 col-form-label form-label"
                      >
                        Full name
                      </label>
                      <div className="col-sm-4 mb-3 mb-lg-0">
                        <input
                          type="text"
                          className={`form-control ${formErrors.firstname ? 'is-invalid' : ''}`}
                          placeholder="First name"
                          id="firstname"
                          value={formData.firstname}
                          onChange={handleChange}
                          required
                        />
                        {formErrors.firstname && (
                        <div className="invalid-feedback">{formErrors.firstname}</div>
                        )}
                      </div>
                      <div className="col-sm-4">
                        <input
                          type="text"
                          className={`form-control ${formErrors.lastname ? 'is-invalid' : ''}`}
                          placeholder="Last name"
                          id="lastname"
                          value={formData.lastname}
                          onChange={handleChange}
                          required
                        />
                        {formErrors.lastname && (
                        <div className="invalid-feedback">{formErrors.lastname}</div>
                        )}
                      </div>
                    </Row>

                    <Row className="mb-3">
                      <label
                        htmlFor="organization"
                        className="col-sm-4 col-form-label form-label"
                      >
                        Organization Name
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className={`form-control ${formErrors.organization ? 'is-invalid' : ''}`}
                          placeholder="Organization name"
                          id="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          required
                        />
                        {formErrors.organization && (
                        <div className="invalid-feedback">{formErrors.organization}</div>
                        )}
                      </div>
                    </Row>

                    <Row className="mb-3">
                      <label
                        htmlFor="email"
                        className="col-sm-4 col-form-label form-label"
                      >
                        Email
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="email"
                          className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                          placeholder="Email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        {formErrors.email && (
                        <div className="invalid-feedback">{formErrors.email}</div>
                        )}
                      </div>
                    </Row>

                    <Row className="mb-3">
                      <label
                        htmlFor="mobile"
                        className="col-sm-4 col-form-label form-label"
                      >
                        Mobile
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          className={`form-control ${formErrors.mobile ? 'is-invalid' : ''}`}
                          placeholder="mobile"
                          id="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                        />
                        {formErrors.mobile && (
                        <div className="invalid-feedback">{formErrors.mobile}</div>
                        )}
                      </div>
                    </Row>

                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="country">
                        Location
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          as={FormSelect}
                          placeholder="Select Country"
                          id="country"
                          options={countryOptions}
                          value={formData.country}
                          onChange={handleChange}
                          className={`form-control ${formErrors.country ? 'is-invalid' : ''}`}
                        />
                        {formErrors.country && (
                        <div className="invalid-feedback">{formErrors.country}</div>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="addressLine">
                        Address line 1
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          type="text"
                          placeholder="Enter Address line 1"
                          id="addressLine"
                          value={formData.addressLine}
                          onChange={handleChange}
                          className={`form-control ${formErrors.addressLine ? 'is-invalid' : ''}`}
                          required
                        />
                        {formErrors.addressLine && (
                        <div className="invalid-feedback">{formErrors.addressLine}</div>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="addressLineTwo">
                        Address line 2
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          type="text"
                          placeholder="Enter Address line 2"
                          id="addressLineTwo"
                          value={formData.addressLineTwo}
                          onChange={handleChange}
                          className={`form-control ${formErrors.addressLineTwo ? 'is-invalid' : ''}`}
                          required
                        />
                        {formErrors.addressLineTwo && (
                        <div className="invalid-feedback">{formErrors.addressLineTwo}</div>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Form.Label className="col-md-4" htmlFor="timeZone">
                        Time Zone
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          as={FormSelect}
                          placeholder="Select TimeZone"
                          id="timeZone"
                          options={timeZoneOptions}
                          value={formData.timeZone}
                          onChange={handleChange}
                          className={`form-control ${formErrors.timeZone ? 'is-invalid' : ''}`}
                        />
                        {formErrors.timeZone && (<div className="invalid-feedback">{formErrors.timeZone}</div>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="zipcode">
                        Zip code
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          type="number"
                          placeholder="Enter Zip code"
                          id="zipcode"
                          value={formData.zipcode}
                          onChange={handleChange}
                          className={`form-control ${formErrors.zipcode ? 'is-invalid' : ''}`}
                          required
                        />
                        {formErrors.zipcode && (
                        <div className="invalid-feedback">{formErrors.zipcode}</div>
                        )}
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Col
            md={{ offset: 4, span: 8 }}
            xs={12}
            className="mt-4 submit-button-container"
          >
            <button
              className="back-next-button"
              onClick={handleNextClick}
            >
              Next
            </button>
          </Col>
        </Form>
      )}

      {!showGeneralForm && (
        <Form className="card-body" onSubmit={handleSubmit}>
          <Row className="mb-8">
            <Col xl={3} lg={4} md={12} xs={12}>
              <div className="mb-4 mb-lg-0">
                <h4 className="mb-1">Login Credentials</h4>
              </div>
            </Col>
            <Col xl={9} lg={8} md={12} xs={12}>
              <Card id="edit">
                <Card.Body>
                  <Row className="mb-3">
                    <Form.Label className="col-md-4" htmlFor="timeZone">
                      Access Level
                    </Form.Label>
                    <Col md={8} xs={12}>
                      <Form.Control
                        as={FormSelect}
                        placeholder="Select Access"
                        id="accessLevel"
                        options={accessLevelOptions}
                        value={formData.accessLevel}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Form.Label className="col-sm-4" htmlFor="username">
                      Username
                    </Form.Label>
                    <Col md={8} xs={12}>
                      <Form.Control
                        type="text"
                        placeholder="Enter your Username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
                        required
                      />
                      {formErrors.username && (
                      <div className="invalid-feedback">{formErrors.username}</div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Form.Label className="col-sm-4" htmlFor="password">
                      New password
                    </Form.Label>
                    <Col md={8} xs={12}>
                      <Form.Control
                        type="password"
                        placeholder="Enter New password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                        required
                      />
                      {formErrors.password && (
                      <div className="invalid-feedback">{formErrors.password}</div>
                      )}
                    </Col>
                  </Row>

                  <Row className="align-items-center">
                    <Form.Label className="col-sm-4" htmlFor="confirmpassword">
                      Confirm new password
                    </Form.Label>
                    <Col md={8} xs={12}>
                      <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        id="confirmpassword"
                        value={formData.confirmpassword}
                        onChange={handleChange}
                        className={`form-control ${formErrors.confirmpassword ? 'is-invalid' : ''}`}
                        required
                      />
                      {formErrors.confirmpassword && (
                      <div className="invalid-feedback">{formErrors.confirmpassword}</div>
                      )}
                    </Col>
                    <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                      <h6 className="mb-1">Password requirements:</h6>
                      <p>Ensure that these requirements are met:</p>
                      <ul>
                        <li>Minimum 8 characters long the more, the better</li>
                        <li>At least one lowercase character</li>
                        <li>At least one uppercase character</li>
                        <li>
                          At least one number, symbol, or whitespace character
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Col
            md={{ offset: 3, span:9 }}
            xs={12}
            className="mt-4 submit-button-container d-flex justify-content-between  "
          >
            <button
              className="back-next-button"
              onClick={() => setShowGeneralForm(true)}
            >
              Back
            </button>
            <button className="submit-button" type="submit" onClick={handleLoginSubmit}>
              Submit
            </button>
          </Col>
        </Form>
      )}
    </div>
  );
};

export default GeneralSetting;
