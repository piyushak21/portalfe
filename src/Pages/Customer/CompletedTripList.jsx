import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Table } from "react-bootstrap";
import axios from "axios";

const CompletedTripList = () => {
  const [tripData, setTripData] = useState();
  let token = localStorage.getItem("token");
  let user_id = localStorage.getItem("user_id");

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/completedTrip/getCompletedTrips/${user_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setTripData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const convertTime = (time) => {
    let updateStTime = new Date(time * 1000);
    return updateStTime.toLocaleString();
  };

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between ">
        <div>
          <h4>Completed Trip List</h4>
          <small>
            <span>Total: {tripData?.length}</span>
          </small>
        </div>
        <div>
          <Link to="/ongoing-trips">
            <button className="btn btn-info">Check Ongoing Trips</button>
          </Link>
        </div>
      </div>
      {/* List of vehicles */}
      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Trip ID</th>
              <th>Vehicle Name</th>
              <th>Registration Number</th>
              <th>Trip Start</th>
              <th>Trip End</th>
              <th>Distance Travelled</th>
              <th>Duration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tripData &&
              tripData.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.trip_id}</td>
                  <td>{row.vehicle_name}</td>
                  <td>{row.vehicle_registration}</td>
                  <td>{convertTime(row.trip_start_time)}</td>
                  <td>{convertTime(row.trip_end_time)}</td>
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
  );
};

export default CompletedTripList;
