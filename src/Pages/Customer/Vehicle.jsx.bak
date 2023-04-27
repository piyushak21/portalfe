import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import axios from "axios";
import DataTable from "react-data-table-component";

const Vehicle = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [search1, setSearch1] = useState([]);
  const [search2, setSearch2] = useState([]);
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

  let counter = 1;
  const columns = [
    {
      name: "#",
      selector: (row) => counter++,
      width: "70px",
    },
    {
      name: "Vehicle Name",
      selector: (row) => row.vehicle_name,
      sortable: true,
    },
    {
      name: "Vehcile Registration",
      selector: (row) => row.vehicle_registration,
    },
    {
      name: "ECU",
      selector: (row) => (row.ecu == "" ? "NA" : row.ecu),
    },
    {
      name: "IoT",
      selector: (row) => (row.iot == "" ? "NA" : row.iot),
    },
    {
      name: "DMS",
      selector: (row) => (row.dms == undefined ? "NA" : row.dms),
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
    {
      name: "Action",
      cell: (row) => (
        <span>
          <small>
            <Link
              to={`/edit-vehicle/${row.vehicle_id}`}
              className="text-decnone"
            >
              <AiFillEdit size={18} className="text-dark mx-2 h4" />
            </Link>

            <Link to={`/vehicle-show/${row.vehicle_id}`}>
              <AiFillEye className="h5 text-dark" />
            </Link>
          </small>
        </span>
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
        <h4>Vehicles</h4>
        <p className="mb-0">Total:{vehicleData?.length}</p>
      </div>
    );
  };

  const searchOne = (e) => {
    setSearch1(e.target.value);
    const result = vehicleData?.filter((el) => {
      return el.vehicle_name.toLowerCase().match(search1.toLowerCase());
    });
    setFilterVehicle(result);
  };

  const searchTwo = (e) => {
    setSearch2(e.target.value);
    const result = vehicleData?.filter((el) => {
      return el.vehicle_registration.toLowerCase().match(search2.toLowerCase());
    });
    setFilterVehicle(result);
  };
  useEffect(() => {
    // console.log(vehicleData);
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
            className="btn btn-theme"
          >
            Add Vehicle
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
                placeholder="Vehicle Reg"
                className="form-control "
                onChange={searchTwo}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0">
        <div className="card-body">
          <DataTable
            customStyles={customStyles}
            columns={columns}
            data={filterVehicle}
            pagination
            highlightOnHover
          />
        </div>
      </div>
    </Container>
  );
};

export default Vehicle;
