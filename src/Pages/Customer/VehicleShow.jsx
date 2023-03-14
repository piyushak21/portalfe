import React, { useState, useEffect } from "react";
import { Container, Table, Modal, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { BsTruck, BsArrowLeft } from "react-icons/bs";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

import axios from "axios";

const VehicleShow = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { vehicle_id } = useParams();
  const [idData, setIdData] = useState(["starkenn"]);
  const [tripData, setTripdata] = useState();

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/vehicles/vehicle-card/${vehicle_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setIdData(res.data.IdData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, vehicle_id]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/completedTrip/getCompletedTripsByVehicleId/${vehicle_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setTripdata(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [vehicle_id, token]);

  const convertTime = (time) => {
    let updateStTime = new Date(time * 1000);
    return updateStTime.toLocaleString();
  };

  return (
    <>
      <Container className="my-5">
        <Link to="/vehicle">
          <BsArrowLeft /> <small>Vehicles</small>
        </Link>
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex">
                  <div className="px-4 align-self-center">
                    <span className="h1">
                      <BsTruck />
                    </span>
                  </div>
                  <div className="px-4">
                    <h5>{idData[0].vehicle_name}</h5>
                    <p className="mb-0">
                      <strong>Registration Number:</strong>{" "}
                      {idData[0].vehicle_registration}
                    </p>
                    <p className="">
                      <strong>ECU:</strong> {idData[0].ecu} |{" "}
                      <strong>IoT:</strong> {idData[0].iot}
                    </p>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={handleShow}
                    >
                      Feature set
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Feature Set</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <JSONInput
              id="a_unique_id"
              locale={locale}
              height="400px"
              width="100%"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save & Update
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="mt-4">
          <div>
            <h4>Toyota Bengluru Trips</h4>
            <p>Total: {tripData?.length}</p>
          </div>
          <Table striped hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Trip ID</th>
                <th>Vehicle Name</th>
                <th>Registration Number</th>
                <th>Trip Start</th>
                <th>Trip End</th>
                <th>Distance Travelled (KM)</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tripData?.map((row, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{row.trip_id}</td>
                  <td>{row.vehicle_name}</td>
                  <td>{row.vehicle_registration}</td>
                  <td>{convertTime(row.trip_start_time)}</td>
                  <td>{row.trip_end_time && convertTime(row.trip_end_time)}</td>
                  <td>{row.total_distance} Km</td>
                  <td>{row.duration}</td>
                  <td>
                    <span className="text-primary">
                      <small>
                        <Link
                          to={`/completed-trips/${row.trip_id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View
                        </Link>
                      </small>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
};

export default VehicleShow;
