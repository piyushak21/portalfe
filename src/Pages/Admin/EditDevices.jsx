import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const EditDevices = () => {
  const { id } = useParams();
  const [idData, setIdData] = useState(["Starkenn"]);
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
  });

  let token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      data.device_id &&
      data.device_type &&
      data.user_id &&
      data.sim_number &&
      data.status
    ) {
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/devices/edit-device/${id}`,
          data,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          console.log(res);
          alert("Device Updated Successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Fill All Details");
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <div>
      <Container className="py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div>
                <div>
                  <Link to="/devices">&#8592; Devices</Link>
                </div>
                <div>
                  <h4>Edit Device</h4>
                </div>
              </div>
              <div className="card mt-3">
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="">Device Id</label>
                    <input
                      type="text"
                      className="form-control"
                      value={idData[0].device_id || ""}
                      name="device_id"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="">Device type</label>
                    <Form.Select
                      name="device_type"
                      onChange={handleChange}
                      value={idData[0].device_type || ""}
                    >
                      <option>- Select Device type -</option>
                      <option value="ECU">ECU</option>
                      <option value="IoT">IoT</option>
                      <option value="DMS">DMS</option>
                    </Form.Select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="">Customer Name</label>
                    <select
                      name="user_i"
                      className="form-control"
                      value={idData[0].user_id || ""}
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
                    <input
                      type="number"
                      className="form-control"
                      value={idData[0].sim_number || ""}
                      name="sim_number"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="">Status</label>
                    <Form.Select
                      name="status"
                      onChange={handleChange}
                      value={idData[0].status || ""}
                    >
                      <option>- Select -</option>
                      <option value="1">Active</option>
                      <option value="2">Deactive</option>
                    </Form.Select>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="mt-2 w-100"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EditDevices;
