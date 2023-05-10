import React, { useEffect, useState } from "react";
import { BsPersonFill, BsFillCpuFill } from "react-icons/bs";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [customerData, setCustomerData] = useState([]);
  const [devices, setDevices] = useState([]);
  // const [vehcicleData, setVehicleData] = useState([]);
  const navigate = useNavigate();

  // const getvehicleData = async () => {
  //   await axios
  //     .get(`${process.env.REACT_APP_BASE_URL}/vehicles/getall`, {
  //       headers: { authorization: `bearer ${token}` },
  //     })
  //     .then((res) => setVehicleData(res.data.getData))
  //     .catch((err) => console.log(err));
  // };

  const getDevicesData = async () => {
    await axios
      .get(`${process.env.REACT_APP_BASE_URL}/devices/getall`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => setDevices(res.data.AllData))
      .catch((err) => console.lohg(err));
  };

  const getCustomersData = async () => {
    await axios
      .get(`${process.env.REACT_APP_BASE_URL}/customers/getall`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setCustomerData(res.data.usersData);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // getvehicleData();
    getDevicesData();
    getCustomersData();
  }, []);

  return (
    <div className="mt-4">
      <Container className="py-5">
        <div className="row">
          <div className="col-md-3">
            <div
              onClick={() => navigate("/users")}
              className="card border text-center text-muted cursor"
            >
              <div className="card-body">
                <BsPersonFill className="h1 display-4 my-2 theme-text" />
                <h1 className="display-4 text-dark">{customerData.length}</h1>
                <h5>Customers</h5>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              onClick={() => navigate("/devices")}
              className="card border text-center text-muted cursor"
            >
              <div className="card-body">
                <BsFillCpuFill className="h1 display-4 my-2 theme-text" />
                <h1 className="display-4 text-dark">{devices.length}</h1>
                <h5>Devices</h5>
              </div>
            </div>
          </div>
          {/* <div className="col-md-3">
            <div className="card border-0 shadow text-muted">
              <div className="card-body text-center">
              <BsTruck className="h1 display-4 my-2" />
            <h1 className="display-4 text-dark">{vehcicleData.length}</h1>
            <h5>Vehicles</h5>
              </div>
            </div>
          </div> */}
        </div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
