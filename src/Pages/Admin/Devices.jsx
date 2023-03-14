import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import Badge from "react-bootstrap/Badge";
import axios from "axios";

const Devices = () => {
  const navigate = useNavigate();

  const [deviceData, setDeviceData] = useState([]);
  let token = localStorage.getItem("token");
  const handleAdd = () => {
    navigate("/devices-add");
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/devices/getall`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setDeviceData(res.data.AllData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="mt-4">
      <Container className="py-5">
        <div className="d-flex justify-content-between">
          <div>
            <h4>Devices</h4>
            <div>Total: {deviceData?.length}</div>
          </div>
          <div>
            <div>
              <Button onClick={handleAdd} variant="dark">
                Add Device
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div className="table-responsive">
            <Table striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Device ID</th>
                  <th>Device Type</th>
                  <th>Customer</th>
                  <th>Sim Number</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {deviceData?.map((el, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{el.device_id}</td>
                      <td>{el.device_type}</td>
                      <td>
                        {el.first_name} {el.last_name}
                      </td>
                      <td>{el.sim_number ? el.sim_number : "NA"}</td>
                      <td>
                        {el.status == "1" ? (
                          <Badge bg="success">Active</Badge>
                        ) : (
                          <Badge bg="danger">Deactive</Badge>
                        )}
                      </td>
                      <td>
                        <span>
                          <small>
                            <Link
                              to={`/devices-edit/${el.id}`}
                              className="text-decnone"
                            >
                              <AiFillEdit
                                size={18}
                                className="text-dark mx-2 h4"
                              />
                            </Link>

                            <Link to={`/devices-show/${el.id}`}>
                              <AiFillEye className="h5 text-dark" />
                            </Link>
                          </small>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Devices;
