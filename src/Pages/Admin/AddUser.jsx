import { useState } from "react";
import { Alert, Container, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Col from "react-bootstrap/Col";
import { TbArrowBackUp } from "react-icons/tb";
import { AiOutlineUserAdd } from "react-icons/ai";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Button } from "react-bootstrap";
import { GrFormAdd } from "react-icons/gr";

const AddUser = () => {
  const [data, setData] = useState({});
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);

  let token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("checkChange");
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("CheckhSubmit");
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity()) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/customers/add-user`, data, {
          headers: { authorization: `bearer ${token}` },
        })
        .then((res) => {
          setError(false);
        })
        .catch((err) => {
          setError(true);
        });
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between">
        <div>
          <h5 className="align-self-center">
            Add Customer
            <GrFormAdd />{" "}
          </h5>
        </div>
        <div className="text-end">
          <Link
            to="/users"
            className="h5"
            style={{ color: "#1B65A9", cursor: "pointer" }}
          >
            <TbArrowBackUp /> Customers
          </Link>{" "}
        </div>
      </div>
      <div>
        {error == null ? (
          ""
        ) : error == false ? (
          <Alert variant={"success"}>Customer Added Successfully</Alert>
        ) : (
          <Alert variant={"danger"}>Failed to add customer</Alert>
        )}
      </div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className="bg-white mt-3 border p-5 rounded">
          <Row className="mb-3">
            <InputGroup as={Col}>
              <FloatingLabel
                controlId="floatingInput1"
                label="First Name"
                className="mb-3"
              >
                <Form.Control
                  name="first_name"
                  onChange={handleChange}
                  type="text"
                  placeholder="First Name"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide first name.
                </Form.Control.Feedback>
              </FloatingLabel>
            </InputGroup>

            <Form.Group as={Col} controlId="lastName">
              <FloatingLabel
                controlId="floatingInput2"
                label="Last Name"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  onChange={handleChange}
                  name="last_name"
                  placeholder="Last Name"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide last name.
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="emailAddress">
              <FloatingLabel
                controlId="floatingInput3"
                label="Email Address"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  onChange={handleChange}
                  name="email"
                  placeholder="Email address"
                  required
                  className={
                    validated
                      ? data.email
                        ? data.email.match(/^\S+@\S+\.\S+$/)
                          ? "is-valid"
                          : "is-invalid"
                        : ""
                      : ""
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide an valid email address.
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridEmail">
              <select
                name="status"
                style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
                className={`form-control ${
                  validated
                    ? data.status
                      ? data.status !== null
                        ? ""
                        : "is-invalid"
                      : "is-invalid"
                    : ""
                }`}
                required
                aria-label="Default select example"
                onChange={handleChange}
              >
                <option value="">--Select Status--</option>
                <option value="1">Active</option>
                <option value="2">Deactive</option>
              </select>
              <Form.Control.Feedback type="invalid">
                Please select any option.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} className="mb-3" controlId="formGroupEmail">
              <FloatingLabel
                controlId="floatingInput4"
                label="Username"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name="username"
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide username.
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                  type="password"
                  minLength={6}
                  maxLength={12}
                  placeholder="Password"
                  onChange={handleChange}
                  name="password"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
          </Row>

          <Row>
            <Col md={12}>
              <Button className="btn-theme" type="submit">
                Add Customer <AiOutlineUserAdd />
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </Container>
  );
};

export default AddUser;
