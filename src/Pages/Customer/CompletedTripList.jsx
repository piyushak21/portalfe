import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import { AiFillEye } from "react-icons/ai";

const CompletedTripList = () => {
  const [tripData, setTripData] = useState();
  const [search1, setSearch1] = useState([]);
  const [search2, setSearch2] = useState([]);
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
  let counter = 1;
  const columns = [
    {
      name: "#",
      selector: (row) => counter++,
      sortable: true,
      width: "70px",
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            onClick={() => navigate(`/completed-trips/${row.trip_id}`)}
            className="btn btn-outline-primary btn-sm"
          >
            View
            <AiFillEye className="h6 mb-1 ms-1" />
          </button>
        </>
      ),
      width: "120px",
    },
    {
      name: "Trip ID",
      selector: (row) => row.trip_id,
      wrap: true,
    },
    {
      name: "Vehicle Name",
      selector: (row) => row.vehicle_name,
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
      selector: (row) => row.duration,
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
    const result = tripData?.filter((el) => {
      return el.trip_id.toLowerCase().match(search1.toLowerCase());
    });
    setFiltertripData(result);
    if (e.target.value === "") {
      setFiltertripData(tripData);
    }
  };

  // Search with Vehicle name
  const searchTwo = (e) => {
    setSearch2(e.target.value);
    const result = tripData?.filter((el) => {
      return el.vehicle_name.toLowerCase().match(search2.toLowerCase());
    });
    setFiltertripData(result);
    if (e.target.value === "") {
      setFiltertripData(tripData);
    }
  };
  useEffect(() => {
    console.log(tripData);
  }, [search1, search2, tripData]);

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
