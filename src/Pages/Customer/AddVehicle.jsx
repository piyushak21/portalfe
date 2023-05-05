import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
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
      .then((res) => {
        setDmsData(res.data.DMSdata);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  return (
    <Container className="my-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="">
                  <Link to="/vehicle">&#8592; Vehicles</Link>
                  <h4>Add Vehicle</h4>
                </div>
                <div>
                  <label htmlFor="">Vehicle Name</label>
                  <InputGroup className="mb-3">
                    <Form.Control name="vehicle_name" onChange={handleChange} />
                  </InputGroup>
                </div>
                <div>
                  <label htmlFor="">Registration Number</label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      name="vehicle_registration"
                      onChange={handleChange}
                    />
                  </InputGroup>
                </div>

                <div>
                  <label htmlFor="">Featureset</label>
                  <InputGroup className="mb-3">
                    <Form.Control name="featureset" onChange={handleChange} />
                  </InputGroup>
                </div>

                <div>
                  <label htmlFor="">Select ECU</label>
                  <Form.Select
                    name="ecu"
                    onChange={handleChange}
                    className="mb-3"
                  >
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
                  <label htmlFor="">Select IoT</label>
                  <Form.Select
                    name="iot"
                    onChange={handleChange}
                    className="mb-3"
                  >
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
                  <label htmlFor="">Select DMS</label>
                  <Form.Select
                    name="dms"
                    onChange={handleChange}
                    className="mb-3"
                  >
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
                <div>
                  <label htmlFor="">Status</label>
                  <Form.Select
                    onChange={handleChange}
                    name="status"
                    className="mb-3"
                  >
                    <option>-Select Status-</option>
                    <option value="0">Deleted</option>
                    <option value="1">Active</option>
                    <option value="2">Deactive</option>
                  </Form.Select>
                </div>
                <div className="text-center">
                  <button className="btn btn-theme w-100 btn-lg" type="submit">
                    SUBMIT
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AddVehicle;
