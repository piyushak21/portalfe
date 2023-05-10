import React, { useState } from "react";
import "./TopNavbar.css";
import { Navbar, Nav, Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  BsFillGrid3X3GapFill,
  BsColumnsGap,
  BsFillCpuFill,
  BsTruck,
  BsPinMapFill,
  BsPersonFill,
  BsJoystick,
  BsPower,
} from "react-icons/bs";
import logo from "../Assets/img/logo.png";
import { useEffect } from "react";
import axios from "axios";

const TopNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const user_type = localStorage.getItem("user_type");
  const user_id = localStorage.getItem("user_id");
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_id");
    navigate("/");
    window.location.reload();
  };

  const handleNotification = () => {
    setOpen(!open);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/customers/get-user/${user_id}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data.IdData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  if (token) {
    return (
      <div className="sticky-top">
        <div className="topnav py-3 px-2 bg-white">
          <div className="d-flex flex-row-reverse justify-content-between">
            <div>
              <Navbar.Brand>
                {user_type == "1" ? (
                  <Link to="/admin-dashboard">
                    <img src={logo} alt="" className="logo mx-5" />
                  </Link>
                ) : (
                  <Link to="/customer-dashboard">
                    <img src={logo} alt="" className="logo mx-5" />
                  </Link>
                )}
              </Navbar.Brand>
            </div>
            <div className="d-flex align-items-center">
              <Nav className="ms-auto">
                <Nav.Link onClick={handleShow}>
                  <span className="h5 top-icon">
                    <BsFillGrid3X3GapFill />
                  </span>
                </Nav.Link>
                <span className="align-self-center">
                  {" "}
                  Hi,{" "}
                  <span className="border-bottom">
                    {userData[0]?.first_name} {userData[0]?.last_name}
                  </span>
                </span>
              </Nav>
            </div>
          </div>
        </div>
        {/* <Navbar bg="white" expand="lg" className="topnav">
          <Container fluid>
            <Navbar.Brand>
              {user_type == 1 ? (
                <Link to="/admin-dashboard">
                  <img src={logo} alt="" className="logo" />
                </Link>
              ) : (
                <Link to="/customer-dashboard">
                  <img src={logo} alt="" className="logo" />
                </Link>
              )}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link to="/" className="mx-2">
                  <span className="h5 top-icon">
                    <BsFillHouseFill />
                  </span>
                </Nav.Link>
                <Nav.Link href="#link" className="mx-2">
                  <span className="h5 top-icon">
                    <BsFillBellFill />
                  </span>
                </Nav.Link>
                <Nav.Link onClick={handleShow} className="ms-2">
                  <span className="h5 top-icon">
                    <BsFillGrid3X3GapFill />
                  </span>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar> */}
        <Offcanvas show={show} onHide={handleClose} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-flex nav-container">
              {user_type == "1" ? (
                <>
                  <Link to="/admin-dashboard">
                    <div className="nav-box" onClick={handleClose}>
                      <span className="h2">
                        <BsColumnsGap />
                      </span>
                      <p className="mt-2">
                        <small>Dashboard</small>
                      </p>
                    </div>
                  </Link>
                  <Link to="/devices">
                    <div className="nav-box" onClick={handleClose}>
                      <span className="h2">
                        <BsFillCpuFill />
                      </span>
                      <p className="mt-2">
                        <small>Devices</small>
                      </p>
                    </div>
                  </Link>
                  <Link to="/users">
                    <div className="nav-box" onClick={handleClose}>
                      <span className="h2">
                        <BsPersonFill />
                      </span>
                      <p className="mt-2">
                        <small>Customers</small>
                      </p>
                    </div>
                  </Link>
                  <Link onClick={handleLogout}>
                    <div className="nav-box">
                      <span className="h2">
                        <BsPower className="fw-bolder" />
                      </span>
                      <p className="mt-2">
                        <small>Sign Out</small>
                      </p>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/customer-dashboard">
                    <div className="nav-box" onClick={handleClose}>
                      <span className="h2">
                        <BsColumnsGap />
                      </span>
                      <p className="mt-2">
                        <small>Dashboard</small>
                      </p>
                    </div>
                  </Link>
                  <Link to="/vehicle">
                    <div className="nav-box" onClick={handleClose}>
                      <span className="h2">
                        <BsTruck />
                      </span>
                      <p className="mt-2">
                        <small>Vehicles</small>
                      </p>
                    </div>
                  </Link>
                  <Link to="/ongoing-trips">
                    <div className="nav-box" onClick={handleClose}>
                      <span className="h2">
                        <BsJoystick />
                      </span>
                      <p className="mt-2">
                        <small>Ongoing Trips</small>
                      </p>
                    </div>
                  </Link>
                  <Link to="/completed-trips">
                    <div className="nav-box" onClick={handleClose}>
                      <span className="h2">
                        <BsPinMapFill />
                      </span>
                      <p className="mt-2">
                        <small>Completed Trips</small>
                      </p>
                    </div>
                  </Link>
                  <Link to="/customer-devices">
                    <div className="nav-box" onClick={handleClose}>
                      <span className="h2">
                        <BsFillCpuFill />
                      </span>
                      <p className="mt-2">
                        <small>Devices</small>
                      </p>
                    </div>
                  </Link>
                  <Link onClick={handleLogout}>
                    <div className="nav-box">
                      <span className="h2">
                        <BsPower className="fw-bolder" />
                      </span>
                      <p className="mt-2">
                        <small>Sign Out</small>
                      </p>
                    </div>
                  </Link>
                </>
              )}

              {/* <div className="nav-box">
                <span className="h2">
                  <BsFilePerson />
                </span>
                <p className="mt-2">
                  <small>Drivers</small>
                </p>
              </div>
              <Link to="/vehicles">
                <div className="nav-box">
                  <span className="h2">
                    <BsTruck />
                  </span>
                  <p className="mt-2">
                    <small>Vehicles</small>
                  </p>
                </div>
              </Link>
              <Link to="/completed-trips">
                <div className="nav-box">
                  <span className="h2">
                    <BsPinMapFill />
                  </span>
                  <p className="mt-2">
                    <small>Trips</small>
                  </p>
                </div>
              </Link>
              <div className="nav-box">
                <span className="h2">
                  <BsPersonFill />
                </span>
                <p className="mt-2">
                  <small>Contacts</small>
                </p>
              </div>
              <div className="nav-box">
                <span className="h2">
                  <BsExclamationCircle />
                </span>
                <p className="mt-2">
                  <small>Alert Triggers</small>
                </p>
              </div>
              <div className="nav-box">
                <span className="h2">
                  <BsFillGeoFill />
                </span>
                <p className="mt-2">
                  <small>Geofencing</small>
                </p>
              </div>
              <div className="nav-box">
                <span className="h2">
                  <BsFillFilePdfFill />
                </span>
                <p className="mt-2">
                  <small>Reports</small>
                </p>
              </div>
              <div className="nav-box">
                <span className="h2">
                  <BsFillFileFill />
                </span>
                <p className="mt-2">
                  <small>RFID</small>
                </p>
              </div>
              <div className="nav-box">
                <span className="h2">
                  <BsPaypal />
                </span>
                <p className="mt-2">
                  <small>Payment</small>
                </p>
              </div> */}
            </div>
          </Offcanvas.Body>
        </Offcanvas>
        {open ? (
          <div onClick={handleNotification} className="clickdiv"></div>
        ) : (
          ""
        )}
        {open ? (
          <div className="notificationdiv">
            <div>
              <h5 className="my-3 border-0 mx-4 rounded-2 ">Notification</h5>
            </div>

            <div className="d-flex flex-column gap-1">
              <div className="d-flex justify-content-around border-0 p-3 mx-2 border-bottom">
                <div className="border rounded-2 align-self-center">
                  <h3 className="px-2">
                    <BsFillCpuFill />
                  </h3>
                </div>
                <div className="">
                  <p className="text-start ms-2 mb-1">
                    <small>You have Notification about vehicle Added</small>
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-around border-0 p-3 mx-2 border-bottom">
                <div className="border rounded-2 align-self-center">
                  <h3 className="px-2">
                    <BsFillCpuFill />
                  </h3>
                </div>
                <div className="">
                  <p className="text-start ms-2 mb-1">
                    <small>You have Notification about vehicle Added</small>
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-around border-0 p-3 mx-2 border-bottom">
                <div className="border rounded-2 align-self-center">
                  <h3 className="px-2">
                    <BsFillCpuFill />
                  </h3>
                </div>
                <div className="">
                  <p className="text-start ms-2 mb-1">
                    <small>You have Notification about vehicle Added</small>
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-around border-0 p-3 mx-2 border-bottom">
                <div className="border rounded-2 align-self-center">
                  <h3 className="px-2">
                    <BsFillCpuFill />
                  </h3>
                </div>
                <div className="">
                  <p className="text-start ms-2 mb-1">
                    <small>You have Notification about vehicle Added</small>
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-around border-0 p-3 mx-2 border-bottom">
                <div className="border rounded-2 align-self-center">
                  <h3 className="px-2">
                    <BsFillCpuFill />
                  </h3>
                </div>
                <div className="">
                  <p className="text-start ms-2 mb-1">
                    <small>You have Notification about vehicle Added</small>
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-around border-0 p-3 mx-2 border-bottom">
                <div className="border rounded-2 align-self-center">
                  <h3 className="px-2">
                    <BsFillCpuFill />
                  </h3>
                </div>
                <div className="">
                  <p className="text-start ms-2 mb-1">
                    <small>You have Notification about vehicle Added</small>
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-around border-0 p-3 mx-2 border-bottom">
                <div className="border rounded-2 align-self-center">
                  <h3 className="px-2">
                    <BsFillCpuFill />
                  </h3>
                </div>
                <div className="">
                  <p className="text-start ms-2 mb-1">
                    <small>You have Notification about vehicle Added</small>
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-around border-0 p-3 mx-2 border-bottom">
                <div className="border rounded-2 align-self-center">
                  <h3 className="px-2">
                    <BsFillCpuFill />
                  </h3>
                </div>
                <div className="">
                  <p className="text-start ms-2 mb-1">
                    <small>You have Notification about vehicle Added</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  } else {
    return "";
  }
};

export default TopNavbar;
