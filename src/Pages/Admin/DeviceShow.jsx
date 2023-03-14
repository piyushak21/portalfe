import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link, useParams } from "react-router-dom";
import { FcMultipleDevices } from "react-icons/fc";
import axios from "axios";

const DeviceShow = () => {
  const [idData, setIdData] = useState(["starkenn"]);
  const { id } = useParams();
  let token = localStorage.getItem("token");

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

  return (
    <div className="mt-4">
      <Container className="py-5">
        <div>
          <Link to="/devices">&#8592; Devices</Link>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div>
                  <FcMultipleDevices size={50} />
                </div>
                <div>
                  <p>
                    <strong>Sim Number: </strong>
                    {idData[0].sim_number}
                  </p>
                  <p>
                    <strong>Device_type: </strong> {idData[0].device_type} |{" "}
                    <strong>Device_id: </strong>
                    {idData[0].device_id}
                  </p>
                  <Button variant="info">Feature set</Button>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DeviceShow;
