import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";

///Display customer list

const Users = () => {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState([]);
  const token = localStorage.getItem("token");
  const [search1, setSearch1] = useState([]);
  const [search2, setSearch2] = useState([]);
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

  let counter = 1;

  const columns = [
    {
      name: "#",
      selector: (row) => counter++,
      width: "70px",
    },
    {
      name: "First Name",
      selector: (row) => row.first_name,
    },
    {
      name: "Last Name",
      selector: (row) => row.last_name,
    },
    {
      name: "UserName",
      selector: (row) => row.username,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },

    {
      name: "Status",
      selector: (row) =>
        row.status == 1 ? (
          <span class="badge bg-success">Active</span>
        ) : (
          <span class="badge bg-danger">Deactive</span>
        ),
      width: "120px",
    },
    {
      name: "Action",
      cell: (row) => (
        <span>
          <small>
            <Link to={`/users-edit/${row.user_id}`} className="text-decnone">
              <AiFillEdit size={18} className="text-dark mx-2 h4" />
            </Link>

            <Link to={`/users-show/${row.user_id}`}>
              <AiFillEye className="h5 text-dark" />
            </Link>
          </small>
        </span>
      ),
      width: "120px",
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "70px",
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
        <h4>Customers</h4>
        <p className="mb-0">Total:{customerData?.length}</p>
      </div>
    );
  };
  const searchOne = (e) => {
    setSearch1(e.target.value);
    const result = customerData?.filter((el) => {
      return el.first_name.toLowerCase().match(search1.toLowerCase());
    });
    setFilterCustomer(result);
  };

  const searchTwo = (e) => {
    setSearch2(e.target.value);
    const result = customerData?.filter((el) => {
      return el.email.toLowerCase().match(search2.toLowerCase());
    });
    setFilterCustomer(result);
  };
  useEffect(() => {
    console.log(filterCustomer);
  }, [search1, search2, filterCustomer]);

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between mb-3">
        <div className="align-self-center">
          <CustomHeader />
        </div>
        <div className="text-end">
          <button
            onClick={() => navigate("/users-add")}
            className="btn btn-theme"
          >
            Add Customer
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

      <div className="card">
        <div className="card-body">
          <DataTable
            customStyles={customStyles}
            columns={columns}
            data={filterCustomer}
            pagination
            highlightOnHover
          />
        </div>
      </div>
    </Container>
  );
};

export default Users;
