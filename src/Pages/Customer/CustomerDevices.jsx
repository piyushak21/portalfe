import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { GrPrevious, GrNext } from "react-icons/gr";
import { Link } from "react-router-dom";

const CustomerDevices = () => {
  const [devicesData, setDevicesData] = useState([]);
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [filterDevices, setFilterDevices] = useState([]);

  const getDevicesData = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/devices/get-user-device/${user_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setDevicesData(res.data.idData);
        setFilterDevices(res.data.idData);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getDevicesData();
  }, []);

  const columns = [
    {
      name: "Sr No.",
      selector: (row, ind) => devicesData.indexOf(row) + 1,
      width: "100px",
      sortable: true,
    },
    {
      name: "Device ID",
      selector: (row) => (!row.device_id ? "NA" : row.device_id),
      sortable: true,
    },
    {
      name: "Device Type",
      selector: (row) => (!row.device_type ? "NA" : row.device_type),
      sortable: true,
    },
    {
      name: "Sim Number",
      selector: (row) => (!row.sim_number ? "NA" : row.sim_number),
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) =>
        row.status === 1 ? (
          <span className="badge px-3 bg-success">Active</span>
        ) : (
          <span className="badge bg-danger">Deactive</span>
        ),
      width: "100px",
      sortable: true,
    },
  ];

  // Table custom styling
  const customStyles = {
    rows: {
      style: {
        minHeight: "70px",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#112b3c",
        fontWeight: "light",
        fontSize: "16px",
        border: "none",
        minHeight: "50px",
        color: "#fff",
      },
    },
    cells: {
      style: {
        border: "none",
        fontSize: "16px",
      },
    },
  };

  // Set page headings
  const CustomHeader = () => {
    return (
      <div>
        <div>
          {" "}
          <Link to="/customer-dashboard">&#8592; Dashboard</Link>
        </div>
        <h4>
          Devices
          <span
            className="rounded-pill text-light bg-danger ms-2 px-3 py-1"
            style={{ fontSize: "14px", fontWeight: "400" }}
          >
            Total: {filterDevices?.length}
          </span>
        </h4>

        {/* <p className="mb-0" >Total: {tripData?.length}</p> */}
      </div>
    );
  };

  // Search with device_id
  const searchOne = (e) => {
    if (e.target.value === "") {
      setFilterDevices(devicesData);
    }
    setSearch1(e.target.value);
  };

  // Search with device_type
  const searchTwo = (e) => {
    if (e.target.value === "") {
      setFilterDevices(devicesData);
    }
    setSearch2(e.target.value);
  };
  useEffect(() => {
    if (search1) {
      const result = devicesData?.filter((el) => {
        return el.device_id?.toLowerCase().match(search1?.toLowerCase());
      });
      setFilterDevices(result);
    }
    if (search2) {
      const result = devicesData?.filter((el) => {
        return el.device_type?.toLowerCase().match(search2?.toLowerCase());
      });
      setFilterDevices(result);
    }
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

      <div className="card border-0 shadow">
        <div className="card-body p-0">
          <DataTable
            customStyles={customStyles}
            columns={columns}
            data={filterDevices}
            highlightOnHover
            pagination
          />
        </div>
      </div>
    </Container>
  );
};

export default CustomerDevices;
