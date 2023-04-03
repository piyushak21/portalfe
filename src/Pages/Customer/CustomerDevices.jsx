import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const CustomerDevices = () => {
  const [devicesData, setDevicesData] = useState([]);
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [search1, setSearch1] = useState([]);
  const [search2, setSearch2] = useState([]);
  const [filterDevices, setFilterDevices] = useState([]);
  const navigate = useNavigate();

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
        setFilterDevices(res.data.idData);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getDevicesData();
  }, []);

  let counter = 1;
  const columns = [
    {
      name: "#",
      selector: (row) => counter++,
      width: "70px",
    },
    {
      name: "Device Id",
      selector: (row) => row.device_id,
    },
    {
      name: "Device Type",
      selector: (row) => row.device_type,
    },
    {
      name: "Sim Numbver",
      selector: (row) => (row.sim_number == undefined ? "NA" : row.sim_number),
    },

    {
      name: "Status",
      selector: (row) =>
        row.status == 1 ? (
          <span class="badge bg-success">Active</span>
        ) : (
          <span class="badge bg-danger">Deactive</span>
        ),
      width: "100px",
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "50px",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#f5f5f5",
        fontWeight: "bold",
        fontSize: "16px",
        border: "none",
        minHeight: "50px",
      },
    },
    cells: {
      style: {
        border: "none",
        fontSize: "15px",
      },
    },
  };

  const CustomHeader = () => {
    return (
      <div>
        <h4>Devices</h4>
        <p className="mb-0">Total:{devicesData?.length}</p>
      </div>
    );
  };

  const searchOne = (e) => {
    setSearch1(e.target.value);
    const result = devicesData?.filter((el) => {
      return el.device_id.toLowerCase().match(search1.toLowerCase());
    });
    setFilterDevices(result);
  };

  const searchTwo = (e) => {
    setSearch2(e.target.value);
    const result = devicesData?.filter((el) => {
      return el.device_type.toLowerCase().match(search2.toLowerCase());
    });
    setFilterDevices(result);
  };
  useEffect(() => {
    console.log(devicesData);
  }, [search1, search2]);

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between mb-3">
        <div className="align-self-center">
          <CustomHeader />
        </div>
        <div className="align-self-end">
          <div className="d-flex gap-4 mt-1">
            <div>
              <input
                type="text"
                placeholder="Device Id"
                className="form-control"
                onChange={searchOne}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Device type"
                className="form-control "
                onChange={searchTwo}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <DataTable
            customStyles={customStyles}
            columns={columns}
            data={filterDevices}
            pagination
            highlightOnHover
          />
        </div>
      </div>
    </Container>
  );
};

export default CustomerDevices;
