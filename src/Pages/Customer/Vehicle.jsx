import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import axios from "axios";
import DataTable from "react-data-table-component";
import { BsTruck } from "react-icons/bs";

const Vehicle = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [filterVehicle, setFilterVehicle] = useState([]);
  const navigate = useNavigate();

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
        setFilterVehicle(res.data.VehiData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user_id, token]);

  const columns = [
    {
      name: "Sr No.",
      selector: (row, ind) => vehicleData.indexOf(row) + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Vehicle Name",
      selector: (row) => (!row.vehicle_name ? "NA" : row.vehicle_name),
      sortable: true,
      wrap: true,
      width: "170px",
    },
    {
      name: "Registration No.",
      selector: (row) =>
        !row.vehicle_registration ? "NA" : row.vehicle_registration,
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "ECU",
      selector: (row) => (!row.ecu ? "NA" : row.ecu),
      sortable: true,
    },
    {
      name: "IoT",
      selector: (row) => (!row.iot ? "NA" : row.iot),
      sortable: true,
    },
    {
      name: "DMS",
      selector: (row) => (!row.dms ? "NA" : row.dms),
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
    {
      name: "Action",
      cell: (row) => (
        <span>
          <small>
            <Link
              to={`/edit-vehicle/${row.vehicle_id}`}
              className="text-decnone btn btn-theme-border btn-sm"
            >
              <AiFillEdit size={18} />
            </Link>
            <Link
              to={`/vehicle-show/${row.vehicle_id}`}
              className="btn btn-theme-border ms-2 btn-sm"
            >
              <AiFillEye />
            </Link>
          </small>
        </span>
      ),
      width: "130px",
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
          Vehicles
          <span
            className="rounded-pill text-light ms-2 px-3 bg-danger px-2 py-1"
            style={{ fontSize: "14px", fontWeight: "400" }}
          >
            Total: {filterVehicle?.length}
          </span>
        </h4>

        {/* <p className="mb-0" >Total: {tripData?.length}</p> */}
      </div>
    );
  };

  // Search with vehicle name
  const searchOne = (e) => {
    if (e.target.value === "") {
      setFilterVehicle(vehicleData);
    }
    setSearch1(e.target.value);
  };

  // Search with Vehicle registration
  const searchTwo = (e) => {
    if (e.target.value === "") {
      setFilterVehicle(vehicleData);
    }
    setSearch2(e.target.value);
  };
  useEffect(() => {
    if (search1) {
      const result = vehicleData?.filter((el) => {
        return el.vehicle_name.toLowerCase().match(search1.toLowerCase());
      });
      setFilterVehicle(result);
    }

    if (search2) {
      const result = vehicleData?.filter((el) => {
        return el.vehicle_registration
          .toLowerCase()
          .match(search2.toLowerCase());
      });
      setFilterVehicle(result);
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
            onClick={() => navigate("/add-vehicle")}
            className="btn btn-theme mb-3"
          >
            Add Vehicle <BsTruck />
          </button>
          <div className="d-flex gap-4 mt-1">
            <div>
              <input
                type="text"
                placeholder="Vehicle Name"
                className="form-control "
                onChange={searchOne}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Registration No."
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
            data={filterVehicle}
            highlightOnHover
            pagination
          />
        </div>
      </div>
    </Container>
  );
};

export default Vehicle;
