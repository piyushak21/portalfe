import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import mainImg2 from "../Assets/img/mainImg2.png";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { AiOutlineLogin } from "react-icons/ai";
import Typed from "react-typed";
import { Alert } from "react-bootstrap";

const Login = () => {
  const [data, setData] = useState({});
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);

    if (form.checkValidity()) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/login/login-user`, data)
        .then((res) => {
          console.log(res.data);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user_type", res.data.user_type);
          localStorage.setItem("user_id", res.data.user_id);
          if (res.data.user_type === 1) {
            navigate("/admin-dashboard");
            setError(false);
          } else {
            navigate("/customer-dashboard");
            setError(true);
          }
        })
        .catch((err) => {
          setError(true);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  return (
    <>
      <div className="container">
        <div className="pt-2">
          {error == null ? (
            ""
          ) : error == false ? (
            <Alert variant={"success"}>successfully Signin </Alert>
          ) : (
            <Alert variant={"danger"}>
              Failed to signin, please provide valid credentials.{" "}
            </Alert>
          )}
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-md-7">
            <img src={mainImg2} alt="Logo" className="img-fluid w-100" />
          </div>
          <div className="col-md-4 offset-md-1">
            {/* <div className="mb-4 text-center">
              <img src={logo} alt="Logo" className="img-fluid w-50" />
            </div> */}
            <div className="card py-4 mt-5 shadow-sm rounded bg-light border-0">
              <div className="card-body mb-4">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <div>
                    <div className="text-center py-1">
                      <Typed
                        style={{
                          color: "#112b3c",
                          fontSize: "1.5rem",
                          fontWeight: "500",
                        }}
                        strings={["Welcome to Portal 3.0"]}
                        typeSpeed={55}
                      />
                      {/* <h4 className="text-muted mb-2">Welcome to</h4>
                      <p className="text-muted">
                        <small>Portal 3.0</small>
                      </p> */}
                    </div>
                    <div className="mt-5">
                      {/* <InputGroup className="mb-5"> */}
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Email"
                        className="mb-5 text-muted"
                      >
                        <Form.Control
                          className="border-bottom border-0 border-dark border-1 bg-light rounded-0"
                          onChange={handleChange}
                          name="email"
                          type="email"
                          maxLength={30}
                          pattern="/^[^\s@]+@[^\s@]+\.[^\s@]+$/\"
                          placeholder="username"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid Email
                        </Form.Control.Feedback>
                      </FloatingLabel>
                      {/* </InputGroup> */}
                    </div>

                    <div>
                      {/* <InputGroup className="mb-3"> */}
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Password"
                        className="mb-5 text-muted"
                      >
                        <Form.Control
                          className="border-bottom border-0 border-dark bg-light border-1 rounded-0"
                          onChange={handleChange}
                          name="password"
                          type="password"
                          placeholder="Password"
                          aria-label="Password"
                          aria-describedby="basic-addon1"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid password.
                        </Form.Control.Feedback>
                      </FloatingLabel>
                      {/* </InputGroup> */}
                    </div>
                    <div className="text-center">
                      <Button
                        className="btn btn-theme border-0 px-5 mt-1"
                        type="submit"
                      >
                        Login <AiOutlineLogin style={{ color: "#ffffff" }} />
                      </Button>
                    </div>
                    {/* <div className="text-muted text-center mt-2">
                      <a href="">Forgot Password?</a>
                    </div> */}
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
