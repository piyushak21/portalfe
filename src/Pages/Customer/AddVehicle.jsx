import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import styles from "../../CSS/AddVehicle.module.css";
import axios from "axios";

const AddVehicle = () => {
  const [data, setData] = useState([]);
  const [iotData, setIotData] = useState([]);
  const [ecuData, setEcuData] = useState([]);
  const [dmsData, setDmsData] = useState([]);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      data.vehicle_name &&
      data.vehicle_registration &&
      data.ecu &&
      data.iot &&
      data.status &&
      data.featureset
    ) {
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/vehicles/addvehicle/${user_id}`,
          data,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          console.log(res);
          alert("Vehicle Added Successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Fill All Details");
    }
  };

  useEffect(() => {
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

    ///getting DMS data
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/vehicles/get-dms`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => setDmsData(res.data.dmsData))
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <Container>
      <div>
        <div className={styles.formdiv}>
          <form onSubmit={handleSubmit}>
            <div>
              <Link to="/vehicle">Vehicles</Link>
            </div>
            <div>
              <h3>Add Vehicle</h3>
            </div>
            <div className="d-flex gap-4 justify-content-center">
              <div className={styles.griddiv}>
                <div>
                  <p>Vehicle_Name</p>
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="VEHICLE_NAME"
                      name="vehicle_name"
                      onChange={handleChange}
                    />
                  </InputGroup>
                </div>
                <div>
                  <p>Registration Number</p>
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="VEHICLE_REGISTRATION"
                      name="vehicle_registration"
                      onChange={handleChange}
                    />
                  </InputGroup>
                </div>

                <div>
                  <p>Featureset</p>
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="FEATURESET"
                      name="featureset"
                      onChange={handleChange}
                    />
                  </InputGroup>
                </div>
                <div>
                  <p>Status</p>
                  <Form.Select onChange={handleChange} name="status">
                    <option>-Select Status-</option>
                    <option value="0">Deleted</option>
                    <option value="1">Active</option>
                    <option value="2">Deactive</option>
                  </Form.Select>
                </div>
              </div>
              <div className={styles.griddiv}>
                <div>
                  <p>Select ECU</p>
                  <Form.Select name="ecu" onChange={handleChange}>
                    <option>-Select ECU-</option>
                    {ecuData?.map((el) => {
                      return (
                        <option key={el.id} value={`${el.device_id}`}>
                          {el.device_id}
                        </option>
                      );
                    })}
                  </Form.Select>
                </div>
                <div>
                  <p>Select IoT</p>

                  <Form.Select name="iot" onChange={handleChange}>
                    <option>-Select IoT-</option>
                    {iotData?.map((el) => {
                      return (
                        <option key={el.id} value={`${el.device_id}`}>
                          {el.device_id}
                        </option>
                      );
                    })}
                  </Form.Select>
                </div>
                <div>
                  <p>Select DMS</p>

                  <Form.Select name="dms" onChange={handleChange}>
                    <option>-Select DMS-</option>
                    <option value={null}>Unassign</option>
                    {dmsData?.map((el) => {
                      return (
                        <option key={el.id} value={`${el.device_id}`}>
                          {el.device_id}
                        </option>
                      );
                    })}
                  </Form.Select>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <Button
                style={{ width: "600px", marginTop: "2rem" }}
                type="submit"
                variant="primary"
              >
                SUBMIT
              </Button>{" "}
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default AddVehicle;
