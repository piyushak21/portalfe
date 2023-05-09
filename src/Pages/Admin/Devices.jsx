import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import axios from "axios";
import DataTable from "react-data-table-component";
import { BsArrowLeftRight } from "react-icons/bs";
import { GrPrevious, GrNext } from "react-icons/gr";

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
      selector: (row, ind) => (currentPage - 1) * itemsPerPage + ind + 1,
    },
    {
      name: "Device Id",
      selector: (row) => (!row.device_id ? "NA" : row.device_id),
    },
    {
      name: "Device Type",
      selector: (row) => (!row.device_type ? "NA" : row.device_type),
    },
    {
      name: "Customer",
      selector: (row) =>
        !row.first_name ? "NA" : row.first_name + " " + row.last_name,
    },
    {
      name: "Sim Number",
      selector: (row) => (!row.sim_number ? "NA" : row.sim_number),
    },

    {
      name: "Status",
      selector: (row) =>
        row.status == 1 ? (
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

            <Link
              to={`/devices-show/${row.id}`}
              className="btn btn-theme-border ms-2 btn-sm"
            >
              <AiFillEye />
            </Link>
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(filterDevices.length / itemsPerPage);
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
  const currentItems = filterDevices.slice(indexOfFirstItem, indexOfLastItem);
  const Pagination = () => {
    return (
      <div className="d-flex justify-content-between mt-3 mb-5">
        {/* <div>
          <select onChange={handleItemsPerPageChange}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div> */}
        <div>
          Showing {currentItems.length} of {filterDevices.length} items
        </div>
        <div>
          <button
            className="border prev text-dark mx-1 py-1 border-0 bg-light"
            title="Previous"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <GrPrevious />
          </button>
          {/* {currentPage > 1 && (
            <button className="pages border text-dark py-1 px-2 border-dark" onClick={() => handlePageChange(currentPage - 2)}>
              {currentPage - 2}
            </button>
          )}
          
          {currentPage > 1 && (
            <button className=" pages border text-dark py-1 px-2 border-dark" onClick={() => handlePageChange(currentPage - 1)}>
              {currentPage - 1}
            </button>
          )} */}

          <button className="pages border text-dark py-1 px-2 " disabled>
            {currentPage}
          </button>
          {currentPage < totalPages && (
            <button
              className="pages border-0 text-dark py-1 px-2"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              {currentPage + 1}
            </button>
          )}
          {currentPage > 1 && (
            <button
              className=" pages border-0 text-dark py-1 px-2"
              onClick={() => handlePageChange(currentPage + 2)}
            >
              {currentPage + 2}
            </button>
          )}
          <button
            className="border next text-dark mx-1 py-1"
            title="Next"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <GrNext />
          </button>
        </div>
      </div>
    );
  };
  // Set page headings
  const CustomHeader = () => {
    return (
      <div>
        <h4>
          Devices
          <span
            className="rounded-pill ms-2 text-light bg-danger px-3 py-1"
            style={{ fontSize: "14px", fontWeight: "400" }}
          >
            Total: {filterDevices?.length}
          </span>
        </h4>
        <div className="mt-4">
          <span>Show&nbsp;</span>
          <select onChange={handleItemsPerPageChange} className="px-1">
            <option style={{ display: "none" }}>{itemsPerPage}</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
          <span>&nbsp;entries</span>
        </div>
        {/* <p className="mb-0" >Total: {tripData?.length}</p> */}
      </div>
    );
  };
  // Search with device_id
  const searchOne = (e) => {
    setSearch1(e.target.value);
  };

  // Search with device_type
  const searchTwo = (e) => {
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
            Add Devices
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
            data={currentItems}
            highlightOnHover
            pointerOnHover
          />
        </div>
      </div>
      <Pagination />
    </Container>
  );
};

export default Devices;
