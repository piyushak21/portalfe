import { useState, useEffect } from "react";
import { Alert, Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Col from "react-bootstrap/Col";
import { TbArrowBackUp } from "react-icons/tb";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Button } from "react-bootstrap";
import { BiSave } from "react-icons/bi";
import { MdEdit } from "react-icons/md";

const EditDevices = () => {
  const { id } = useParams();
  const [idData, setIdData] = useState(["Starkenn"]);
  const [data, setData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  let token = localStorage.getItem("token");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
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
    if (
      data?.device_type ||
      data?.device_id ||
      data?.user_id ||
      data?.sim_number ||
      data?.status
    ) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [data]);

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
          `${process.env.REACT_APP_BASE_URL}/devices/edit-device/${id}`,
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

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/devices/get-device-card/${id}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setIdData(res.data.idData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <Container className="p-3">
      <div className="d-flex justify-content-between">
        <div>
          <h5>
            Edit Device
            <MdEdit />{" "}
          </h5>
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
      <div>
        {error == null ? (
          ""
        ) : error == false ? (
          <Alert variant={"success"}>Device updated successfully</Alert>
        ) : (
          <Alert variant={"danger"}>Failed to updated device</Alert>
        )}
      </div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className="bg-white mt-3 border p-5 rounded">
          <Row className="mb-3 justify-content-md-center">
            <Col md={6}>
              <Form.Group>
                <FloatingLabel
                  controlId="floatingInput1"
                  label="Device ID"
                  className="mb-3"
                >
                  <Form.Control
                    onChange={handleChange}
                    type="text"
                    defaultValue={idData[0].device_id || ""}
                    name="device_id"
                    placeholder="Device ID"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a Device ID.
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group as={Col} controlId="formGridEmail">
                <FloatingLabel controlId="exampleSelect1" label="Device Type">
                  <select
                    name="device_type"
                    defaultValue={idData[0].device_type || ""}
                    style={{ paddingTop: "1.55rem", paddingBottom: "1rem" }}
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
                    <option value="">{idData[0].device_type}</option>
                    <option value="ECU">ECU</option>
                    <option value="IoT">IoT</option>
                    <option value="DMS">DMS</option>
                  </select>
                </FloatingLabel>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3 justify-content-md-center">
            <Col md={12}>
              <Form.Group as={Col} controlId="formGridEmail">
                <FloatingLabel controlId="exampleSelect2" label="Customer Name">
                  <select
                    name="user_id"
                    defaultValue={idData[0].user_id || ""}
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
                      {idData[0].first_name + " " + idData[0].last_name}{" "}
                    </option>
                    {customerData?.map((item) => {
                      return (
                        <option value={item.user_id} key={item.user_id}>
                          {item.first_name} {item.last_name}
                        </option>
                      );
                    })}
                  </select>
                </FloatingLabel>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3 justify-content-md-center">
            <Col md={6}>
              <Form.Group as={Col} className="mb-3" controlId="formGroupEmail">
                <FloatingLabel
                  controlId="floatingInput4"
                  label="Sim Number"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    defaultValue={idData[0].sim_number || ""}
                    name="sim_number"
                    maxLength={10}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a sim number.
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col md={6}>
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
          <Row>
            <Col md={8} className="justify-content-md-center">
              <Button
                className="btn-theme"
                type="submit"
                disabled={disableButton}
              >
                Save Changes <BiSave />
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </Container>
  );
};

export default EditDevices;
