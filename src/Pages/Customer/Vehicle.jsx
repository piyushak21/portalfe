import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import Badge from "react-bootstrap/Badge";
import axios from "axios";

const Vehicle = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/vehicles/user-vehicle/${user_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res);
        setVehicleData(res.data.VehiData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user_id, token]);

  return (
    <div className="my-5">
      <Container>
        <div className="d-flex justify-content-between">
          <div>
            <h4>Vehicles</h4>
            <h6>Total: {vehicleData.length}</h6>
          </div>
          <div>
            <div>
              <Link to="/add-vehicle">
                <Button variant="dark">ADD NEW</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <Table striped>
            <thead>
              <tr>
                <th>SR.NO</th>
                <th>vehicle_name</th>
                <th>vehicle_registration</th>
                <th>ECU</th>
                <th>IoT</th>
                <th>status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vehicleData?.map((el, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{el.vehicle_name}</td>
                    <td>{el.vehicle_registration}</td>
                    <td>{el.ecu}</td>
                    <td>{el.iot}</td>
                    <td>
                      {el.status === 1 ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="danger">Deactive</Badge>
                      )}
                    </td>
                    <td>
                      <span>
                        <small>
                          <Link
                            to={`/edit-vehicle/${el.vehicle_id}`}
                            className="text-decnone"
                          >
                            <AiFillEdit
                              size={18}
                              className="text-dark mx-2 h4"
                            />
                          </Link>

                          <Link to={`/vehicle-show/${el.vehicle_id}`}>
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
      </Container>
    </div>
  );
};

export default Vehicle;
