import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import logo from "../Assets/img/logo.png";

const Login = () => {
  const [data, setData] = useState({});

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/login/login-user`, data)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_type", res.data.user_type);
        localStorage.setItem("user_id", res.data.user_id);
        if (res.data.user_type === 1) {
          navigate("/admin-dashboard");
        } else {
          navigate("/customer-dashboard");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("InValid Credentials");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  return (
    <>
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-4">
            <div className="mt-5 mb-2 text-center">
              <img src={logo} alt="Logo" className="img-fluid w-50" />
            </div>
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div>
                    <div className="text-center">
                      <h4 className="text-muted mb-0">LOGIN</h4>
                      <p className="text-muted">
                        <small>Portal 3.0</small>
                      </p>
                    </div>
                    <div className="mt-3">
                      <InputGroup className="mb-3">
                        <Form.Control
                          onChange={handleChange}
                          name="email"
                          type="email"
                          placeholder="Email Address"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                        />
                      </InputGroup>
                    </div>

                    <div>
                      <InputGroup className="mb-3">
                        <Form.Control
                          onChange={handleChange}
                          name="password"
                          type="password"
                          placeholder="Password"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                        />
                      </InputGroup>
                    </div>
                    <div>
                      <Button
                        className="btn w-100"
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
