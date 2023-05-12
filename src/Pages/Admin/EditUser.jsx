import React, { useEffect, useState } from "react";
import { Container, Tabs, Tab, Form, InputGroup, Alert } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { TbArrowBackUp } from "react-icons/tb";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Button, Col } from "react-bootstrap";
import { BiSave } from "react-icons/bi";
import { MdEdit } from "react-icons/md";

const EditUser = () => {
  const { user_id } = useParams();
  const [data, setData] = useState([]);
  const [idData, setIdData] = useState(["Starkenn"]);
  const [master_customer, setMaster_customer] = useState(["Master_customer"]);
  const [isData, setIsData] = useState(false);
  const [putData, setPutData] = useState([]);
  const token = localStorage.getItem("token");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handlemasterChange = (e) => {
    let { name, value } = e.target;
    setPutData({ ...putData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity()) {
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/customers/edit-user/${user_id}`,
          data,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          setError(false);
        })
        .catch((err) => {
          setError(true);
        });
    }
  };

  ///get Data

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/customers/get-user/${user_id}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setIdData(res.data.IdData);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/customers/getall/${user_id}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setMaster_customer(res.data.getData);
        if (res.data.getData.length > 0) {
          setIsData(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  ///Master Customer

  const handleMasterSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity()) {
      if (master_customer.length > 0) {
        axios
          .put(
            `${process.env.REACT_APP_BASE_URL}/customers/edit-customer/${master_customer[0].customer_id}`,
            putData,
            {
              headers: { authorization: `bearer ${token}` },
            }
          )
          .then((res) => {
            setError(false);
          })
          .catch((err) => {
            setError(true);
          });
      } else {
        axios
          .post(
            `${process.env.REACT_APP_BASE_URL}/customers/add-customer/${user_id}`,
            putData,
            {
              headers: { authorization: `bearer ${token}` },
            }
          )
          .then((res) => {
            setError(false);
          })
          .catch((err) => {
            setError(true);
          });
      }
    }
  };

  return (
    <Container className="mt-4 mb-5 text-center">
      <div className="d-flex justify-content-between">
        <div>
          <h5 className="align-self-center">
            Edit Customer
            <MdEdit />
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
          <Alert variant={"success"}>Customer updated Successfully</Alert>
        ) : (
          <Alert variant={"danger"}>Failed to updated customer</Alert>
        )}
      </div>
      <Tabs
        defaultActiveKey="auth"
        id="uncontrolled-tab-example"
        className="justify-content-md-center h6"
        onClick={() => setError(null)}
      >
        <Tab eventKey="auth" title="Customer Details">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="bg-white border-0 shadow p-5 rounded">
              <Row className="mb-3 justify-content-md-center">
                <Col md={8}>
                  <Form.Group>
                    <FloatingLabel
                      controlId="floatingInput1"
                      label="First Name"
                      className="mb-3"
                    >
                      <Form.Control
                        name="first_name"
                        onChange={handleChange}
                        type="text"
                        defaultValue={idData[0].first_name}
                        placeholder="First Name"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a first name.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 justify-content-md-center">
                <Col md={8}>
                  <Form.Group controlId="lastName">
                    <FloatingLabel
                      controlId="floatingInput2"
                      label="Last Name"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        onChange={handleChange}
                        defaultValue={idData[0]?.last_name}
                        name="last_name"
                        placeholder="Last Name"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a last name.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 justify-content-md-center">
                <Col md={8}>
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
                        defaultValue={idData[0]?.email}
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
                </Col>
              </Row>
              <Row className="mb-3 justify-content-md-center">
                <Col md={8}>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <FloatingLabel
                      controlId="exampleSelect"
                      label="Select an option"
                    >
                      <select
                        name="status"
                        style={{ paddingTop: "1.55rem", paddingBottom: "1rem" }}
                        className={`form-control ${
                          validated
                            ? data.status
                              ? data.status !== null
                                ? ""
                                : "is-invalid"
                              : "is-invalid"
                            : ""
                        }`}
                        aria-label="Default select example"
                        onChange={handleChange}
                      >
                        <option value="">
                          {idData[0]?.status == 1 ? "Active" : "Deactive"}
                        </option>
                        <option value="1">Active</option>
                        <option value="2">Deactive</option>
                      </select>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 justify-content-md-center">
                <Col md={8}>
                  <Form.Group
                    as={Col}
                    className="mb-3"
                    controlId="formGroupEmail"
                  >
                    <FloatingLabel
                      controlId="floatingInput4"
                      label="Username"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="username"
                        onChange={handleChange}
                        defaultValue={idData[0].username}
                        placeholder="Username"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a username.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Button className="btn-theme" type="submit">
                    Save Changes <BiSave />
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        </Tab>

        <Tab eventKey="other" title="Other Details">
          {/* Master Customer */}
          <Form noValidate validated={validated} onSubmit={handleMasterSubmit}>
            <div className="bg-white border-0 shadow p-5 rounded">
              <Row className="mb-3 justify-content-md-center">
                <Col md={8}>
                  <Form.Group>
                    <FloatingLabel
                      controlId="floatingInput1"
                      label="Company Name"
                      className="mb-3"
                    >
                      <Form.Control
                        name="company_name"
                        onChange={handlemasterChange}
                        type="text"
                        defaultValue={master_customer[0]?.company_name}
                        placeholder="Company Name"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a Company name.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 justify-content-md-center">
                <Col md={8}>
                  <Form.Group as={Col} controlId="lastName">
                    <FloatingLabel
                      controlId="floatingInput2"
                      label="Address"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        onChange={handlemasterChange}
                        defaultValue={master_customer[0]?.address}
                        name="address"
                        placeholder="Address"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a Address.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3 justify-content-md-center">
                <Col md={8}>
                  <Form.Group
                    as={Col}
                    className="mb-3"
                    controlId="formGroupEmail"
                  >
                    <FloatingLabel
                      controlId="floatingInput4"
                      label="City"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        defaultValue={master_customer[0]?.city}
                        name="city"
                        onChange={handlemasterChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a city.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 justify-content-md-center">
                <Col md={8}>
                  <Form.Group as={Col} controlId="Address">
                    <FloatingLabel
                      controlId="floatingInput3"
                      label="State"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        defaultValue={master_customer[0]?.state}
                        name="state"
                        onChange={handlemasterChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide an State.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 justify-content-md-center">
                <Col md={8}>
                  <Form.Group as={Col} className="mb-3">
                    <FloatingLabel
                      controlId="floatingInput4"
                      label="Pincode"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        maxLength={6}
                        name="pincode"
                        defaultValue={master_customer[0]?.pincode}
                        onChange={handlemasterChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a pincode number.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 justify-content-md-center">
                <Col md={8}>
                  <Form.Group
                    as={Col}
                    className="mb-3"
                    controlId="formGroupEmail"
                  >
                    <FloatingLabel
                      controlId="floatingInput4"
                      label="Contact Number"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        maxLength={10}
                        pattern="/^?[6-9]\d{9}$/"
                        name="phone"
                        defaultValue={master_customer[0]?.phone}
                        onChange={handlemasterChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a contact number.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Button className="btn-theme" type="submit">
                    Save Changes <BiSave />
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default EditUser;
