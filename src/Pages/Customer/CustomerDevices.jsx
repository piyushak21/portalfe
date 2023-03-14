import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

const CustomerDevices = () => {
  const [devicesData, setDevicesData] = useState([]);
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  const getDevicesData = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/devices/get-user-device/${user_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res);
        setDevicesData(res.data.idData);
      })
      .catch((err) => console.log(err));
  };
  console.log(devicesData);
  useEffect(() => {
    getDevicesData();
  }, []);

  return (
    <div className="mt-4">
      <Container className="py-5">
        <h4>Customer Devices</h4>

        <div className="table-responsive">
          <Table>
            <thead>
              <tr>
                <th>SR.No</th>
                <th>Device_id</th>
                <th>Device_type</th>
                <th>Sim_Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {devicesData?.map((el, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{el.device_id}</td>
                    <td>{el.device_type}</td>
                    <td>{el.sim_number ? el.sim_number : "NA"}</td>
                    <td>
                      {" "}
                      {el.status == "1" ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="danger">Deactive</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default CustomerDevices;
