import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import axios from "axios";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Alert, Col, Button } from "react-bootstrap";
import { TbArrowBackUp } from "react-icons/tb";
import { GrFormAdd } from "react-icons/gr";
import { BsTruck } from "react-icons/bs";

const AddVehicle = () => {
  const [data, setData] = useState([]);
  const [iotData, setIotData] = useState([]);
  const [ecuData, setEcuData] = useState([]);
  const [dmsData, setDmsData] = useState([]);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity()) {
      if (data.dms || (data.iot && data.ecu)) {
        axios
          .post(
            `${process.env.REACT_APP_BASE_URL}/vehicles/addvehicle/${user_id}`,
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
      } else {
        setError(true);
      }
    }
  };

  useEffect(() => {
    ///getting data of iot remaining
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/vehicles/get-iot/${user_id}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setIotData(res.data.IotData);
      })
      .catch((err) => {
        console.log(err);
      });

    ///getting ecu remaining
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/vehicles/get-ecu/${user_id}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setEcuData(res.data.ECUData);
      })
      .catch((err) => {
        console.log(err);
      });

    ///getting DMS data
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/vehicles/get-dms/${user_id}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setDmsData(res.data.DMSdata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between">
        <div>
          <h5>
            Add Vehicle
            <GrFormAdd />{" "}
          </h5>
        </div>
        <div className="text-end">
          <Link
            to="/vehicle"
            className="h5"
            style={{ color: "#1B65A9", cursor: "pointer" }}
          >
            <TbArrowBackUp /> Vehicles
          </Link>{" "}
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div>
            {error == null ? (
              ""
            ) : error == false ? (
              <Alert variant={"success"}>Vehicle Added Successfully</Alert>
            ) : (
              <Alert variant={"danger"}>Failed to add vehicle</Alert>
            )}
          </div>
          <div className="card">
            <div className="card-body">
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div></div>
                <Row className="mb-3">
                  <Col md={6}>
                    <InputGroup as={Col}>
                      <FloatingLabel
                        controlId="vehicle_name"
                        label="Vehicle Name"
                        className="mb-3"
                      >
                        <Form.Control
                          name="vehicle_name"
                          onChange={handleChange}
                          type="text"
                          placeholder="Vehicle Name"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a Vehicle Name.
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="lastName">
                      <FloatingLabel
                        controlId="floatingInput2"
                        label="Registration No."
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          onChange={handleChange}
                          name="vehicle_registration"
                          placeholder="Vehicle Registration"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a Vehicle Registration.
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <select
                        name="ecu"
                        style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
                        className={`form-control `}
                        required
                        aria-label="Default select example"
                        onChange={handleChange}
                      >
                        <option>-Select ECU-</option>
                        {ecuData?.map((el) => {
                          return (
                            <option key={el.id} value={`${el.device_id}`}>
                              {el.device_id}
                            </option>
                          );
                        })}
                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select any ECU.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group as={Col}>
                      <select
                        name="iot"
                        style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
                        className={`form-control`}
                        required
                        aria-label="Default select example"
                        onChange={handleChange}
                      >
                        <option>-Select IoT-</option>
                        {iotData?.map((el) => {
                          return (
                            <option key={el.id} value={`${el.device_id}`}>
                              {el.device_id}
                            </option>
                          );
                        })}
                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select any IoT.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group as={Col}>
                      <select
                        name="dms"
                        style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
                        className={`form-control `}
                        required
                        aria-label="Default select example"
                        onChange={handleChange}
                      >
                        <option>-Select DMS-</option>
                        {dmsData?.map((el) => {
                          return (
                            <option key={el.id} value={`${el.device_id}`}>
                              {el.device_id}
                            </option>
                          );
                        })}
                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select any DMS.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group as={Col}>
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
                        <option>-Select Status-</option>
                        <option value="1">Active</option>
                        <option value="2">Deactive</option>
                      </select>
                      <Form.Control.Feedback type="invalid">
                        Please select any status.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Button className="btn-theme" type="submit">
                      Add Vehicle <BsTruck />
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

export default AddVehicle;
