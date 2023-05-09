import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import axios from "axios";
import DataTable from "react-data-table-component";

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
      name: "#",
      selector: (row, ind) => (currentPage - 1) * itemsPerPage + ind + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: "Vehicle Name",
      selector: (row) => (!row.vehicle_name ? "NA" : row.vehicle_name),
      sortable: true,
    },
    {
      name: "Vehicle Registration",
      selector: (row) =>
        !row.vehicle_registration ? "NA" : row.vehicle_registration,
    },
    {
      name: "ECU",
      selector: (row) => (!row.ecu ? "NA" : row.ecu),
    },
    {
      name: "IoT",
      selector: (row) => (!row.iot ? "NA" : row.iot),
    },
    {
      name: "DMS",
      selector: (row) => (!row.dms ? "NA" : row.dms),
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(filterVehicle.length / itemsPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleItemsPerPageChange = (e) => {
    setCurrentPage(1);
    setItemsPerPage(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterVehicle.slice(indexOfFirstItem, indexOfLastItem);
  const Pagination = () => {
    return (
      <div>
        <div>
          <select onChange={handleItemsPerPageChange}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {currentPage > 1 && (
            <button onClick={() => handlePageChange(currentPage - 1)}>
              {currentPage - 1}
            </button>
          )}
          <button disabled>{currentPage}</button>
          {currentPage < totalPages && (
            <button onClick={() => handlePageChange(currentPage + 1)}>
              {currentPage + 1}
            </button>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        <div>
          Showing {currentItems.length} of {filterVehicle.length} items
        </div>
      </div>
    );
  };

  // Search with vehicle name
  const searchOne = (e) => {
    setSearch1(e.target.value);
  };

  // Search with Vehicle registration
  const searchTwo = (e) => {
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

  const handleClick = (row) => {
    navigate(`/vehicle-show/${row.vehicle_id}`);
  };

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

      <div className="card">
        <div className="card-body">
          <DataTable
            customStyles={customStyles}
            columns={columns}
            data={currentItems}
            pagination
            highlightOnHover
            onRowClicked={handleClick}
            pointerOnHover
          />
        </div>
      </div>
      <Pagination />
    </Container>
  );
};

export default Vehicle;
