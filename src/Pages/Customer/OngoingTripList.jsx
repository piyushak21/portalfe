import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import { AiFillEye } from "react-icons/ai";
import { BsArrowLeftRight } from "react-icons/bs";
import { GrPrevious, GrNext } from "react-icons/gr";

const OngoingTripList = () => {
  const [tripData, setTripData] = useState();
  let token = localStorage.getItem("token");
  let user_id = localStorage.getItem("user_id");
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [filtertripData, setFiltertripData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = (async) => {
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/ongoingTrip/getOngoingTrips/${user_id}`,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          setTripData(res.data);
          setFiltertripData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, [token]);

  const convertTime = (time) => {
    let updateStTime = new Date(time * 1000);
    return updateStTime.toLocaleString();
  };

  const columns = [
    {
      name: "Sr No.",
      selector: (row) => filtertripData.indexOf(row) + 1,
      sortable: true,
      width: "70px",
    },

    {
      name: "Trip ID",
      selector: (row) => row.trip_id,
      wrap: true,
      sortable: true,
    },
    {
      name: "Vehicle Name",
      selector: (row) => row.vehicle_name,
      wrap: true,
      sortable: true,
    },
    {
      name: "Reg Number",
      selector: (row) => row.vehicle_registration,
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
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => navigate(`/tripview/${row.trip_id}`)}
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
          Ongoing Trips{" "}
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
  }, [search1, search2]);

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between mb-3">
        <div className="align-self-center">
          <CustomHeader />
        </div>
        <div className="text-end">
          <button
            onClick={() => navigate("/completed-trips")}
            className="btn btn-theme mb-3"
          >
            Completed Trips&nbsp;&nbsp;
            <BsArrowLeftRight />
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

      <div className="card border-0 shadow">
        <div className="card-body p-0">
          <DataTable
            customStyles={customStyles}
            columns={columns}
            data={filtertripData}
            highlightOnHover
            pagination
          />
        </div>
      </div>
    </Container>
  );
};

export default OngoingTripList;
