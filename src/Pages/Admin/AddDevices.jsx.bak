import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";

///Adding Device to Data

const AddDevice = () => {
  let token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(data);
    if (
      data.device_id &&
      data.device_type &&
      data.user_id &&
      data.sim_number &&
      data.status
    ) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/devices/add-device`, data, {
          headers: { authorization: `bearer ${token}` },
        })
        .then((res) => {
          console.log(res);
          alert("Device Added Successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Fill All Details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div>
                  <Link to="/devices">&#8592; Devices</Link>
                  <h4>Add Device</h4>
                </div>
                <hr />
                <div>
                  <div className="mb-3">
                    <label htmlFor="">Device Id</label>
                    <InputGroup onChange={handleChange}>
                      <Form.Control required name="device_id" />
                    </InputGroup>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="">Device Type</label>
                    <Form.Select onChange={handleChange} name="device_type">
                      <option>-Select Device Type-</option>
                      <option value="ECU">ECU</option>
                      <option value="IoT">IoT</option>
                      <option value="DMS">DMS</option>
                    </Form.Select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="">Customer Name</label>
                    <select
                      name="user_id"
                      className="form-control"
                      id=""
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
                  </div>
                  <div className="mb-3">
                    <label htmlFor="">Sim Number</label>
                    <InputGroup onChange={handleChange}>
                      <Form.Control name="sim_number" maxLength={10} />
                    </InputGroup>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="">Status</label>
                    <Form.Select onChange={handleChange} name="status">
                      <option value="">- Select -</option>
                      <option value="1">Active</option>
                      <option value="2">Deactive</option>
                    </Form.Select>
                  </div>
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

export default AddDevice;
