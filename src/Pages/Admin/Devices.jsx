import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import axios from "axios";
import DataTable from "react-data-table-component";
import { GrPrevious, GrNext } from "react-icons/gr";
import { MdOutlineDevicesOther } from "react-icons/md";

const Devices = () => {
  const navigate = useNavigate();
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");

  const [filterDevices, setFilterDevices] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  let token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/devices/getall`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setDeviceData(res.data.AllData);
        setFilterDevices(res.data.AllData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    {
      name: "SR.NO",
      selector: (row, ind) => filterDevices.indexOf(row) + 1,
      sortable: true,
    },
    {
      name: "Device Id",
      selector: (row) => (!row.device_id ? "NA" : row.device_id),
      sortable: true,
    },
    {
      name: "Device Type",
      selector: (row) => (!row.device_type ? "NA" : row.device_type),
      sortable: true,
    },
    {
      name: "Customer",
      selector: (row) =>
        !row.first_name ? "NA" : row.first_name + " " + row.last_name,
      sortable: true,
    },
    {
      name: "Sim Number",
      selector: (row) => (!row.sim_number ? "NA" : row.sim_number),
      sortable: true,
    },

    {
      name: "Status",
      sortable: true,
      selector: (row) =>
        row.device_status == 1 ? (
          <span className="badge px-3 bg-success">Active</span>
        ) : (
          <span className="badge bg-danger">Deactive</span>
        ),
    },
    {
      name: "Action",
      cell: (row) => (
        <span>
          <small>
            <Link
              to={`/devices-edit/${row.id}`}
              className="btn btn-theme-border btn-sm"
            >
              <AiFillEdit size={18} />
            </Link>

            {/* <Link
              to={`/devices-show/${row.id}`}
              className="btn btn-theme-border ms-2 btn-sm"
            >
              <AiFillEye />
            </Link> */}
          </small>
        </span>
      ),
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
          <Link to="/admin-dashboard">&#8592; Dashboard</Link>
        </div>
        <h4>
          Devices
          <span
            className="rounded-pill ms-2 text-light bg-danger px-3 py-1"
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
      setFilterDevices(deviceData);
    }
    setSearch1(e.target.value);
  };

  // Search with device_type
  const searchTwo = (e) => {
    if (e.target.value === "") {
      setFilterDevices(deviceData);
    }
    setSearch2(e.target.value);
  };
  useEffect(() => {
    if (search1) {
      const result = filterDevices?.filter((el) => {
        return el.device_id?.toLowerCase().match(search1?.toLowerCase());
      });
      setFilterDevices(result);
    }
    if (search2) {
      const result = filterDevices?.filter((el) => {
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
        <div className="text-end">
          <button
            onClick={() => navigate("/devices-add")}
            className="btn btn-theme mb-3"
          >
            Add Devices <MdOutlineDevicesOther />
          </button>
          <div className="d-flex gap-4 mt-1">
            <div>
              <input
                type="text"
                placeholder="Device Id"
                className="form-control "
                onChange={searchOne}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Device Type"
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

export default Devices;
