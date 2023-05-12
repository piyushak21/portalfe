import React, { useState, useEffect, useRef } from "react";
import { Container, Table, Modal, Button } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { BsTruck, BsArrowLeft } from "react-icons/bs";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import DatePicker from "react-datepicker";
import axios from "axios";
// import logo from "../../Assets/img/logo.png";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { useReactToPrint } from "react-to-print";

const VehicleShow = () => {
  const [show, setShow] = useState(false);
  const tableRef = useRef(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [faultCount, setCount] = useState(0);
  // const [filteredData, setFilteredData] = useState();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  // const [isDownloadDisabled, setIsDownloadDisabled] = useState(true);

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const { vehicle_id } = useParams();
  const [idData, setIdData] = useState(["starkenn"]);
  const [tripData, setTripdata] = useState();

  let navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("user_id");

  // Get vehicle data
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/vehicles/vehicle-card/${vehicle_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setIdData(res.data.IdData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, vehicle_id]);

  // Get completed trips by using vehicle ID
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/completedTrip/getCompletedTripsByVehicleId/${vehicle_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setTripdata(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [vehicle_id, token]);

  const handleDateChange = (date, field) => {
    if (field === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
      setIsButtonDisabled(false);
    }
  };

  const filterData = () => {
    let filteredData = tripData;
    if (startDate && endDate) {
      filteredData = filteredData.filter((item) => {
        let upStTime = convertTime(item.trip_start_time);
        const chkdate = new Date(upStTime);
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        return chkdate >= startDateObj && chkdate <= endDateObj;
      });
    }
    return filteredData;
  };

  const convertTime = (time) => {
    let updateStTime = new Date(time * 1000);
    // return updateStTime;
    return updateStTime.toString();
  };

  const curretDate = new Date();
  const year = curretDate.getFullYear();
  const month = String(curretDate.getMonth() + 1).padStart(2, "0");
  const day = String(curretDate.getDate()).padStart(2, "0");

  const convertTimeToLocal = (time) => {
    let updateStTime = new Date(time * 1000);
    return updateStTime.toLocaleString();
  };

  // Redirect to trip page
  const handleRedirect = (tripId) => {
    navigate(`/completed-trips/${tripId}`);
  };

  const handleFault = (e) => {
    let fault = e.target.value;
    console.log(startDate, endDate);
    if (fault !== "") {
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/completedTrip/getAllAlertsByVehicleId/${userID}/${vehicle_id}/${fault}/${startDate}/${endDate}`,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((response) => {
          // console.log(response.data);
          setCount(response.data.count);
          // setIsDownloadDisabled(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setCount(0);
    }
  };

  const generatePDF = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: "tripData",
    // onAfterPrint: () => alert("Data saved in PDF"),
  });

  return (
    <>
      <Container className="mt-4 mb-5" ref={tableRef}>
        <Link to="/vehicle">
          <BsArrowLeft /> <small>Vehicles</small>
        </Link>
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex">
                  <div className="px-4 align-self-center">
                    <span className="h1 mb-0">
                      <BsTruck />
                    </span>
                  </div>
                  <div className="px-4 w-100">
                    <div className="d-flex justify-content-between">
                      <h5>Vehicle Name: {idData[0].vehicle_name}</h5>
                      {/* <span onClick={handleShow} className="cursor">
                        <BsGearFill />
                      </span> */}
                    </div>
                    <p className="mb-0">
                      <strong>Registration Number:</strong>{" "}
                      {idData[0].vehicle_registration}
                    </p>
                    <p className="mb-0">
                      {idData[0].ecu && (
                        <>
                          <strong>ECU:</strong> {idData[0].ecu} |
                        </>
                      )}
                      {idData[0].iot && (
                        <>
                          <strong>IoT:</strong> {idData[0].iot} |{" "}
                        </>
                      )}
                      {idData[0].dms && (
                        <>
                          <strong>DMS:</strong> {idData[0].dms}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex gap-3">
              <div>
                <label htmlFor="start-date-picker">From Date: </label>
                <DatePicker
                  id="start-date-picker"
                  selected={startDate}
                  onChange={(date) => handleDateChange(date, "start")}
                  dateFormat="M/d/yyyy, H:mm:ss"
                  className="form-control"
                  placeholderText="-Select Date-"
                />
              </div>
              <div>
                <label htmlFor="end-date-picker">To Date: </label>
                <DatePicker
                  id="end-date-picker"
                  selected={endDate}
                  onChange={(date) => handleDateChange(date, "end")}
                  dateFormat="M/d/yyyy, H:mm:ss"
                  className="form-control"
                  placeholderText="-Select Date-"
                />
              </div>
            </div>

            <div className="mt-2 bg-dark text-light border p-2 rounded-2 d-flex justify-content-between mb-2">
              <select
                className="form-control w-50"
                name="faults"
                onChange={handleFault}
                disabled={isButtonDisabled}
              >
                <option value="">-Select Faults -</option>
                <option value="AutoBrk">Automatic Braking</option>
                <option value="2">Accident Saved</option>
                <option value="13">Sleep Alert Missed</option>
                <option value="2">Harsh Acceleration</option>
                <option value="5">Lane Change</option>
                <option value="4">Speed Bump</option>
                <option value="3">Sudden Braking</option>
                <option value="6">Tailgating</option>
                <option value="7">Overspeeding</option>
                <option value="Drowsiness">Drowsiness</option>
                <option value="Distraction">Distraction</option>
                <option value="DMS_Overspeeding">DMS Overspeeding</option>
                <option value="No_Seatbelt">No Seatbelt</option>
                <option value="Using_Phone">Using Phone</option>
                <option value="Unknown_Driver">Unknown Driver</option>
                <option value="No_Driver">No Driver</option>
                <option value="Smoking">Smoking</option>
                <option value="Rash_Driving">Rash Driving</option>
                <option value="DMS_Accident">DMS Accident</option>
              </select>
              <p className="mb-0 align-self-center">
                Total Count: {faultCount}
              </p>
            </div>

            <div className="text-end d-flex gap-3 justify-content-end">
              <button
                onClick={generatePDF}
                className="btn btn-theme-border btn-sm border-dark"
                // disabled={isDownloadDisabled}
              >
                PDF
              </button>
              <DownloadTableExcel
                filename={`${idData[0].vehicle_name}_${year}-${month}-${day}.pdf`}
                sheet={`${idData[0].vehicle_name}_${year}-${month}-${day}`}
                currentTableRef={tableRef.current}
              >
                <button
                  className="btn btn-theme-border btn-sm border-dark"
                  // disabled={isDownloadDisabled}
                >
                  Excel{" "}
                </button>
              </DownloadTableExcel>
            </div>
          </div>
        </div>

        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Feature Set</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <JSONInput
              id="a_unique_id"
              locale={locale}
              height="400px"
              width="100%"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save & Update
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="mt-4">
          <h4>{idData[0].vehicle_name} Trips</h4>
          <p className="mb-0 align-self-center">
            Total Trips: {filterData()?.length}
          </p>
          <Table striped hover variant="light">
            <thead>
              <tr>
                <th>#</th>
                <th>Trip ID</th>
                <th>Vehicle Name</th>
                <th>Registration Number</th>
                <th>Trip Start</th>
                <th>Trip End</th>
                <th>Distance</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {filterData()?.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => handleRedirect(row.trip_id)}
                  className="cursor"
                >
                  <td>{index + 1}</td>
                  <td>{row.trip_id}</td>
                  <td>{row.vehicle_name}</td>
                  <td>{row.vehicle_registration}</td>
                  <td>{convertTimeToLocal(row.trip_start_time)}</td>
                  <td>{convertTimeToLocal(row.trip_end_time)}</td>
                  <td>{row.total_distance} Km</td>
                  <td>{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
};

export default VehicleShow;
