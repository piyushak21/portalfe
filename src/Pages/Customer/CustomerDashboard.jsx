import React, { useEffect, useState } from "react";
import {
  BsFillCpuFill,
  BsRecycle,
  BsFillCheckSquareFill,
  BsTruck,
} from "react-icons/bs";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  let user_id = localStorage.getItem("user_id");
  let token = localStorage.getItem("token");
  let [vehicleData, setVehicleData] = useState([]);
  let [devicesData, setDevicesData] = useState([]);
  let [tripsCompleted, setTripsCompleted] = useState([]);
  let [tripsOngoing, setTripsOngoing] = useState([]);
  const navigate = useNavigate();

  const getVehicleData = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/vehicles/user-vehicle/${user_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setVehicleData(res.data.VehiData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDevicesData = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/devices/get-user-device/${user_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => setDevicesData(res.data.idData))
      .catch((err) => console.log(err));
  };

  const completedTrips = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/completedTrip/getCompletedTrips/${user_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setTripsCompleted(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const OngoingTrips = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/ongoingTrip/getOngoingTrips/${user_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setTripsOngoing(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getVehicleData();
    getDevicesData();
    completedTrips();
    OngoingTrips();
  }, []);

  return (
    <div className="mt-4">
      <Container className="py-5">
        <div className="row">
          <div onClick={() => navigate("/vehicle")} className="col-md-3">
            <div className="card border-0 shadow mb-3">
              <div className="card-body text-center text-muted">
                <BsTruck className="h1 display-4 my-2" />
                <h1 className="display-4 text-dark">{vehicleData?.length}</h1>
                <h5>Vehicle</h5>
              </div>
            </div>
          </div>
          <div onClick={() => navigate("/ongoing-trips")} className="col-md-3">
            <div className="card border-0 shadow mb-3">
              <div className="card-body text-center text-muted">
                <BsRecycle className="h1 display-4 my-2" />
                <h1 className="display-4 text-dark">{tripsOngoing?.length}</h1>
                <h5>Ongoing</h5>
              </div>
            </div>
          </div>
          <div
            onClick={() => navigate("/completed-trips/")}
            className="col-md-3"
          >
            <div className="card border-0 shadow mb-3">
              <div className="card-body text-center text-muted">
                <BsFillCheckSquareFill className="h1 display-4 my-2" />
                <h1 className="display-4 text-dark">
                  {tripsCompleted?.length}
                </h1>
                <h5>Completed</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div
              onClick={() => navigate("/customer-devices")}
              className="card border-0 shadow mb-3"
            >
              <div className="card-body text-center text-muted">
                <BsFillCpuFill className="h1 display-4 my-2" />
                <h1 className="display-4 text-dark">{devicesData?.length}</h1>
                <h5>Devices</h5>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CustomerDashboard;
