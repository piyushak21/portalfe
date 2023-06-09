import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { AiFillEdit, AiFillEye, AiOutlineUserAdd } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import { GrPrevious, GrNext } from "react-icons/gr";
import { BsPersonAdd } from "react-icons/bs";
///Display customer list
const Users = () => {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState([]);
  const token = localStorage.getItem("token");
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [filterCustomer, setFilterCustomer] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/customers/getall`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setCustomerData(res.data.usersData);
        setFilterCustomer(res.data.usersData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    {
      name: "Sr No.",
      selector: (row, ind) => filterCustomer.indexOf(row) + 1,
      width: "100px",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) =>
        !row.first_name ? "NA" : row.first_name + " " + row?.last_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => (!row.email ? "NA" : row.email),
      sortable: true,
      wrap: true,
    },

    {
      name: "Status",
      selector: (row) =>
        row.status == 1 ? (
          <span className="badge px-3 bg-success">Active</span>
        ) : (
          <span className="badge bg-danger">Deactive</span>
        ),
      width: "120px",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <span>
          <small>
            <Link
              to={`/users-edit/${row.user_id}`}
              className="text-decnone btn btn-theme-border btn-sm"
            >
              <AiFillEdit size={18} />
            </Link>

            <Link
              to={`/users-show/${row.user_id}`}
              className="btn btn-theme-border btn-sm ms-2"
            >
              <AiFillEye />
            </Link>
          </small>
        </span>
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
          <Link to="/admin-dashboard">&#8592; Dashboard</Link>
        </div>
        <h4>
          Customers
          <span
            className="rounded-pill ms-2 text-light bg-danger px-3 py-1"
            style={{ fontSize: "14px", fontWeight: "400" }}
          >
            Total: {filterCustomer?.length}
          </span>
        </h4>

        {/* <p className="mb-0" >Total: {tripData?.length}</p> */}
      </div>
    );
  };

  // Search with trip ID
  const searchOne = (e) => {
    if (e.target.value === "") {
      setFilterCustomer(customerData);
    }

    setSearch1(e.target.value);
  };

  // Search with Vehicle name
  const searchTwo = (e) => {
    if (e.target.value === "") {
      setFilterCustomer(customerData);
    }
    setSearch2(e.target.value);
  };
  useEffect(() => {
    if (search1) {
      const result = filterCustomer?.filter((el) => {
        return el.first_name?.toLowerCase().match(search1?.toLowerCase());
      });
      setFilterCustomer(result);
    }

    if (search2) {
      const result = filterCustomer?.filter((el) => {
        return el.email?.toLowerCase().match(search2?.toLowerCase());
      });
      setFilterCustomer(result);
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
            onClick={() => navigate("/users-add")}
            className="btn btn-theme mb-3"
          >
            Add Customer <AiOutlineUserAdd />
          </button>
          <div className="d-flex gap-4 mt-1">
            <div>
              <input
                type="text"
                placeholder="First name"
                className="form-control "
                onChange={searchOne}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Email"
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
            data={filterCustomer}
            highlightOnHover
            pointerOnHover
            pagination
          />
        </div>
      </div>
    </Container>
  );
};

export default Users;
