import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import { BsArrowLeftRight } from "react-icons/bs";
import { AiFillEye } from "react-icons/ai";

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
  }, [user_id, token]);

  const convertTime = (time) => {
    let updateStTime = new Date(time * 1000);
    return updateStTime.toLocaleString();
  };

  const columns = [
    {
      name: "Sr No.",
      selector: (row, ind) => filtertripData.indexOf(row) + 1,
      width: "100px",
      sortable: true,
    },
    {
      name: "Trip ID",
      selector: (row) => (!row.trip_id ? "NA" : row.trip_id),
      wrap: true,
      width: "200px",
      sortable: true,
    },
    {
      name: "Vehicle",
      selector: (row) => (!row.vehicle_name ? "NA" : row.vehicle_name),
      wrap: true,
      sortable: true,
    },
    {
      name: "Trip Start",
      selector: (row) => {
        return convertTime(row.trip_start_time);
      },
      wrap: true,
      sortable: true,
    },
    {
      name: "Trip End",
      selector: (row) => {
        return row.trip_end_time == 0
          ? convertTime(row.trip_start_time)
          : convertTime(row?.trip_end_time);
      },
      wrap: true,
      sortable: true,
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
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => navigate(`/completed-trips/${row.trip_id}`)}
          className="btn btn-outline-primary btn-sm"
        >
          View
          <AiFillEye className="h6 mb-0 ms-1" />
        </button>
      ),
      width: "120px",
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
          Completed Trips{" "}
          <span
            className="rounded-pill text-light bg-danger px-3 py-1"
            style={{ fontSize: "14px", fontWeight: "400" }}
          >
            Total: {tripData?.length}
          </span>
        </h4>

        {/* <p className="mb-0" >Total: {tripData?.length}</p> */}
      </div>
    );
  };

  // Search with trip ID
  const searchOne = (e) => {
    if (e.target.value === "") {
      setFiltertripData(tripData);
    }
    setSearch1(e.target.value);
  };

  // Search with Vehicle name
  const searchTwo = (e) => {
    if (e.target.value === "") {
      setFiltertripData(tripData);
    }
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
  }, [search1, search2, tripData]);

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between mb-3">
        <div className="align-self-center">
          <CustomHeader />
        </div>
        <div className="text-end">
          <button
            onClick={() => navigate("/ongoing-trips")}
            className="btn btn-theme"
          >
            Ongoing Trips&nbsp;&nbsp;
            <BsArrowLeftRight />
          </button>
          {/* Search bar */}
          <div className="d-flex gap-4 mt-4">
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
                placeholder="Vehicle"
                className="form-control"
                onChange={searchTwo}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow p-0">
        <div className="card-body p-0">
          <DataTable
            customStyles={customStyles}
            noHeader
            columns={columns}
            data={filtertripData}
            pagination
            highlightOnHover
          />
        </div>
      </div>
    </Container>
  );
};

export default CompletedTripList;
