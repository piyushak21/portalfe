import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Button, Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Col } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { BiSave } from "react-icons/bi";
import { TbArrowBackUp } from "react-icons/tb";
import { MdEdit } from "react-icons/md";

const EditVehicle = () => {
  const { vehicle_id } = useParams();
  const [idData, setIdData] = useState(["starkenn"]);
  const [data, setData] = useState([]);
  const [iotData, setIotData] = useState([]);
  const [ecuData, setEcuData] = useState([]);
  const [dmsData, setDmsData] = useState([]);
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    /////////Getting Data of vehicle
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/vehicles/vehicle-card/${vehicle_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(idData);
        setIdData(res.data.IdData);
      })
      .catch((err) => {
        console.log(err);
      });

    ///getting data of iot remaining
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/vehicles/get-iot`, {
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
      .get(`${process.env.REACT_APP_BASE_URL}/vehicles/get-ecu`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setEcuData(res.data.ECUData);
      })
      .catch((err) => {
        console.log(err);
      });

    ///dms data
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/vehicles/get-dms`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setDmsData(res.data.DMSdata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [vehicle_id, token]);

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
          `${process.env.REACT_APP_BASE_URL}/vehicles/editvehicle/${user_id}/${vehicle_id}`,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between">
        <div className="align-self-center">
          <h5>
            Edit Vehicle <MdEdit />
          </h5>
        </div>
        <div className="d-flex justify-content-end p-3">
          <Link
            to="/vehicle"
            className="h5"
            style={{ color: "#1B65A9", cursor: "pointer" }}
          >
            <TbArrowBackUp /> Vehicles
          </Link>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div>
            {error == null ? (
              ""
            ) : error == false ? (
              <Alert variant={"success"}>Vehicle updated Successfully</Alert>
            ) : (
              <Alert variant={"danger"}>Failed to update vehicle</Alert>
            )}
          </div>
          <div className="card">
            <div className="card-body">
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                          defaultValue={idData[0].vehicle_name}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a Vehicle Name.
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </InputGroup>
                  </Col>

                  <Col md={6}>
                    <Form.Group as={Col} controlId="lastName">
                      <FloatingLabel
                        controlId="floatingInput2"
                        label="Registration No."
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          onChange={handleChange}
                          name="vehicle_registration"
                          defaultValue={idData[0].vehicle_registration}
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
                    <Form.Group as={Col}>
                      <FloatingLabel
                        controlId="floatingInput2"
                        label="ECU"
                        className="mb-3"
                      >
                        <select
                          name="ecu"
                          style={{
                            paddingTop: "1.55rem",
                            paddingBottom: "1rem",
                          }}
                          className={`form-control `}
                          aria-label="Default select example"
                          onChange={handleChange}
                        >
                          <option>{idData[0]?.ecu}</option>
                          <option value={null}>Unassign</option>{" "}
                          {ecuData?.map((el) => {
                            return (
                              <option key={el.id} value={`${el.device_id}`}>
                                {el.device_id}
                              </option>
                            );
                          })}
                        </select>
                        <Form.Control.Feedback type="invalid">
                          Please select any option.
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group as={Col}>
                      <FloatingLabel
                        controlId="floatingInput2"
                        label="IoT"
                        className="mb-3"
                      >
                        <select
                          name="iot"
                          style={{
                            paddingTop: "1.55rem",
                            paddingBottom: "1rem",
                          }}
                          className={`form-control `}
                          aria-label="Default select example"
                          onChange={handleChange}
                        >
                          <option>{idData[0]?.iot}</option>
                          <option value={null}>Unassign</option>{" "}
                          {iotData?.map((el) => {
                            return (
                              <option key={el.id} value={`${el.device_id}`}>
                                {el.device_id}
                              </option>
                            );
                          })}
                        </select>
                        <Form.Control.Feedback type="invalid">
                          Please select any option.
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group as={Col}>
                      <FloatingLabel
                        controlId="floatingInput2"
                        label="DMS"
                        className="mb-3"
                      >
                        <select
                          name="dms"
                          style={{
                            paddingTop: "1.55rem",
                            paddingBottom: "1rem",
                          }}
                          className={`form-control `}
                          aria-label="Default select example"
                          onChange={handleChange}
                        >
                          <option>
                            {idData[0].dms == null
                              ? "Not Assign"
                              : idData[0].dms}
                          </option>
                          <option value={null}>Unassign</option>
                          {dmsData?.map((el) => {
                            return (
                              <option key={el.id} value={`${el.device_id}`}>
                                {el.device_id}
                              </option>
                            );
                          })}
                        </select>
                        <Form.Control.Feedback type="invalid">
                          Please select any option.
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group as={Col}>
                      <FloatingLabel
                        controlId="floatingInput2"
                        label="status"
                        className="mb-3"
                      >
                        <select
                          name="status"
                          style={{
                            paddingTop: "1.55rem",
                            paddingBottom: "1rem",
                          }}
                          className={`form-control `}
                          aria-label="Default select example"
                          onChange={handleChange}
                        >
                          <option>
                            {idData[0].status == 1 ? "Active" : "Deactive"}
                          </option>{" "}
                          <option value="1">Active</option>
                          <option value="2">Deactive</option>
                        </select>
                        <Form.Control.Feedback type="invalid">
                          Please select any option.
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
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EditVehicle;
