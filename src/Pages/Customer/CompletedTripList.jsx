import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";

const CompletedTripList = () => {
  const [tripData, setTripData] = useState();
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [filtertripData, setFiltertripData] = useState([]);
  const navigate = useNavigate();
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
        setFiltertripData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const convertTime = (time) => {
    let updateStTime = new Date(time * 1000);
    return updateStTime.toLocaleString();
  };

  const columns = [
    {
      name: "#",
      selector: (row, ind) => (currentPage - 1) * itemsPerPage + ind + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: "Trip ID",
      selector: (row) => (!row.trip_id ? "NA" : row.trip_id),
      wrap: true,
      width: "200px",
    },
    {
      name: "Vehicle Name",
      selector: (row) => (!row.vehicle_name ? "NA" : row.vehicle_name),
      wrap: true,
    },
    {
      name: "Trip Start",
      selector: (row) => {
        return convertTime(row.trip_start_time);
      },
      wrap: true,
    },
    {
      name: "Trip End",
      selector: (row) => {
        return convertTime(row.trip_end_time);
      },
      wrap: true,
    },
    {
      name: "Distance",
      selector: (row) => row.total_distance + " KM",
      wrap: true,
      sortable: true,
      width: "120px",
    },
    {
      name: "Duration",
      selector: (row) => (!row.duration ? "NA" : row.duration),
      wrap: true,
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
        backgroundColor: "#f1f1f1",
        fontWeight: "bold",
        fontSize: "16px",
        border: "none",
        minHeight: "50px",
        color: "#333",
      },
    },
    cells: {
      style: {
        border: "none",
        fontSize: "16px",
      },
    },
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(filtertripData.length / itemsPerPage);
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
  const currentItems = filtertripData.slice(indexOfFirstItem, indexOfLastItem);
  const Pagination = () => {
    return (
      <div>
        <div>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
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
          Showing {currentItems.length} of {filtertripData.length} items
        </div>
      </div>
    );
  };

  // Set page headings
  const CustomHeader = () => {
    return (
      <div>
        <h4>Completed Trips</h4>
        <p className="mb-0">Total: {tripData?.length}</p>
      </div>
    );
  };

  // Search with trip ID
  const searchOne = (e) => {
    setSearch1(e.target.value);
  };

  // Search with Vehicle name
  const searchTwo = (e) => {
    setSearch2(e.target.value);
  };
  useEffect(() => {
    if (search1) {
      const result = tripData?.filter((el) => {
        return el.trip_id.toLowerCase().match(search1.toLowerCase());
      });
      setFiltertripData(result);
    }

    if (search2) {
      const result = tripData?.filter((el) => {
        return el.vehicle_name.toLowerCase().match(search2.toLowerCase());
      });
      setFiltertripData(result);
    }
  }, [search1, search2]);

  const handleClick = (row) => {
    navigate(`/completed-trips/${row.trip_id}`);
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between mb-3">
        <div className="align-self-center">
          <CustomHeader />
        </div>
        <div className="text-end">
          <button
            onClick={() => navigate("/ongoing-trips")}
            className="btn btn-theme"
          >
            Ongoing Trips
          </button>
          {/* Search bar */}
          <div className="d-flex gap-4 mt-1">
            <div>
              <input
                type="text"
                placeholder="Trip Id"
                className="form-control"
                onChange={searchOne}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Vehicle Name"
                className="form-control"
                onChange={searchTwo}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <DataTable
            noHeader
            columns={columns}
            data={currentItems}
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

export default CompletedTripList;
