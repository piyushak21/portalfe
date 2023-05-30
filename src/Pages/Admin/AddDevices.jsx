import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Alert, Col } from "react-bootstrap";
import { MdOutlineAdd } from "react-icons/md";
import { TbArrowBackUp } from "react-icons/tb";
import { GrFormAdd } from "react-icons/gr";

// Adding Device to Data
const AddDevice = () => {
  let token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/users/get-all-users`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setCustomerData(res.data);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  useEffect(() => {
    if (data?.device_type && data?.device_id && data?.user_id && data?.status) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(data);

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);

    if (form.checkValidity()) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/devices/add-device`, data, {
          headers: { authorization: `bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Message === "Device Already Exists") {
            setError(true);
          } else {
            setError(false);
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
    <Container className="my-4">
      <div className="d-flex justify-content-between">
        <div>
          <h4>
            Add Device
            <GrFormAdd />{" "}
          </h4>
        </div>
        <div className="text-end">
          <Link
            to="/devices"
            className="h5"
            style={{ color: "#1B65A9", cursor: "pointer" }}
          >
            <TbArrowBackUp /> Devices
          </Link>{" "}
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div>
            {error == null ? (
              ""
            ) : error == false ? (
              <Alert variant={"success"}>Device Added Successfully</Alert>
            ) : (
              <Alert variant={"danger"}>Failed to add Device</Alert>
            )}
          </div>
          <div className="card">
            <div className="card-body">
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <InputGroup as={Col}>
                    <FloatingLabel
                      controlId="device id"
                      label="Device Id"
                      className="mb-4"
                    >
                      <Form.Control
                        name="device_id"
                        onChange={handleChange}
                        type="text"
                        placeholder="Device Id"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a Device Id.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </InputGroup>

                  <Form.Group as={Col}>
                    <FloatingLabel
                      controlId="floatingInput2"
                      label="Device Type"
                      className="mb-3"
                    >
                      <select
                        name="device_type"
                        style={{ paddingTop: "1.40rem", paddingBottom: "1rem" }}
                        className={`form-control ${
                          validated
                            ? data.device_type
                              ? data.device_type !== null
                                ? ""
                                : "is-invalid"
                              : "is-invalid"
                            : ""
                        }`}
                        aria-label="Default select example"
                        onChange={handleChange}
                      >
                        <option>-Select Device Type-</option>{" "}
                        <option value="ECU">ECU</option>
                        <option value="IoT">IoT</option>
                        <option value="DMS">DMS</option>
                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select any Device type.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <FloatingLabel
                      controlId="floatingInput2"
                      label="Customer Name"
                      className="mb-3"
                    >
                      <select
                        name="user_id"
                        style={{ paddingTop: "1.55rem", paddingBottom: "1rem" }}
                        className={`form-control ${
                          validated
                            ? data.user_id
                              ? data.user_id !== null
                                ? ""
                                : "is-invalid"
                              : "is-invalid"
                            : ""
                        }`}
                        aria-label="Default select example"
                        onChange={handleChange}
                      >
                        <option value="">- Select Customer -</option>
                        {customerData?.map((item) => {
                          return (
                            <option value={item.user_id} key={item.user_id}>
                              {item.first_name} {item.last_name}
                            </option>
                          );
                        })}
                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select any customer.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <InputGroup as={Col}>
                    <FloatingLabel
                      controlId="device id"
                      label="Sim Number"
                      className="mb-3"
                    >
                      <Form.Control
                        name="sim_number"
                        onChange={handleChange}
                        type="text"
                        maxLength={10}
                        placeholder="Sim Number"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a Sim Number.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </InputGroup>

                  <Form.Group as={Col}>
                    <FloatingLabel
                      controlId="floatingInput2"
                      label="Status"
                      className="mb-3"
                    >
                      <select
                        name="status"
                        style={{ paddingTop: "1.40rem", paddingBottom: "1rem" }}
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
                        <option>-Select Status</option>{" "}
                        <option value="1">Active</option>
                        <option value="2">Deactive</option>
                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select any status.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Row>

                <Row>
                  <Col md={12}>
                    <Button
                      className="btn-theme"
                      type="submit"
                      disabled={disableButton}
                    >
                      Add Device <MdOutlineAdd />
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AddDevice;
