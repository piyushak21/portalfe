import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { Container, Tabs, Tab, ListGroup, Badge, Form } from "react-bootstrap";
import { BsPinMapFill, BsArrowLeft } from "react-icons/bs";
import car from "../../Assets/icons/liveIcon.svg";
import Iframe from "react-iframe";

const OngoingTripView = () => {
  let { id } = useParams();
  const [path, setPath] = useState([]);
  const [tripData, setTripData] = useState([]);
  const [center, setCenter] = useState({});
  const [startPoint, setStartPoint] = useState({});
  const [startAddress, setStartAddress] = useState("");
  const [endPoint, setEndPoint] = useState({});
  const [startTime, setStartTime] = useState();
  // const [lastTime, setLastTime] = useState();
  const [endAddress, setEndAddress] = useState("");
  // const [distance, setDistance] = useState("");
  // const [duration, setDuration] = useState("");
  // const [maxSpd, setMaxSpd] = useState("");
  // const [durationInSec, setDurationInSec] = useState();
  // const [avgSpd, setAvgSpd] = useState();
  // const [spdData, setSpdData] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  // const [dmsMedia, setDmsMedia] = useState("");

  // CAS faults
  const [autoBrk, setAutoBrk] = useState(0);
  const [harshacc, setHarshacc] = useState(0);
  const [sleeptAlt, setSleepAlt] = useState(0);
  const [laneChng, setLaneChng] = useState(0);
  const [spdBump, setSpdBump] = useState(0);
  const [suddenBrk, setSuddenBrk] = useState(0);
  const [tailgating, setTailgating] = useState(0);
  const [overspeed, setOverspeed] = useState(0);
  const [accidentSaved, setAccidentSaved] = useState(0);
  const [alarm1, setAlarm1] = useState(0);
  const [alarm2, setAlarm2] = useState(0);

  // SET DMS data & Alerts
  const [media, setMedia] = useState([]);
  const [drowsiness, setDrowsiness] = useState(0);
  const [distraction, setDistraction] = useState(0);
  const [dmsoverSpd, setDmsoverSpd] = useState(0);
  const [noSeatbelt, setNotSeatBelt] = useState(0);
  const [usePhone, setUsePhone] = useState(0);
  const [unknownDriver, setUnknownDriver] = useState(0);
  const [noDriver, setNoDriver] = useState(0);
  const [smoking, setSmoking] = useState(0);
  const [rashDrive, setRashDrive] = useState(0);
  const [dmsAccident, setDmsAccident] = useState(0);
  const [tripStartAlert, setTripStartAlert] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("One");
    const interval = setInterval(() => {
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/ongoingTrip/getOngoingTripdataById/${id}`,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          // console.log(res.data);
          // Set trip data
          setTripData(res.data);

          const dataLength = res.data.length - 1;

          // Set Map center
          setCenter({
            lat: parseFloat(res.data[dataLength].lat),
            lng: parseFloat(res.data[dataLength].lng),
          });

          // Set start point
          setStartPoint({
            lat: parseFloat(res.data[0].lat),
            lng: parseFloat(res.data[0].lng),
          });

          // Set path
          setPath(
            res.data.map((location) => ({
              lat: parseFloat(location.lat),
              lng: parseFloat(location.lng),
            }))
          );

          // Set end point
          setEndPoint({
            lat: parseFloat(res.data[dataLength].lat),
            lng: parseFloat(res.data[dataLength].lng),
          });

          // Set Start time
          let sttime = res.data[0].timestamp;
          let updateStTime = new Date(sttime * 1000);
          setStartTime(updateStTime.toLocaleString());

          // Set Last time
          // let edtime = res.data[dataLength].timestamp;
          // let updateEDTime = new Date(edtime * 1000);
          // setLastTime(updateEDTime.toLocaleString());

          // Set the duration
          // let difference = edtime - sttime;
          // setDurationInSec(difference); // this is use for calculate the avg speed

          // let hours = Math.floor(difference / 3600);
          // difference = difference % 3600;

          // let minutes = Math.floor(difference / 60);
          // difference = difference % 60;
          // let seconds = difference;
          // if (hours > 0) {
          //   setDuration(
          //     hours + " hours " + minutes + " Mins " + seconds + " Sec"
          //   );
          // } else {
          //   setDuration(minutes + " Mins " + seconds + " Sec");
          // }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 30000);
    return () => clearInterval(interval);
  }, [id, token]);

  // Set Address
  useEffect(() => {
    console.log("two");
    if (tripData.length > 0 && startPoint !== "" && endPoint !== "") {
      const getAddress = async (lat, lng, setAddress) => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        // console.log(data);
        setAddress(data.results[0].formatted_address);
      };

      getAddress(startPoint.lat, startPoint.lng, setStartAddress);
      getAddress(endPoint.lat, endPoint.lng, setEndAddress);
    }
  }, [tripData]);

  // Set vehicle data
  useEffect(() => {
    console.log("Four");
    if (tripData.length > 0) {
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/vehicles/getVehicleByTripId/${id}`,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          setVehicle(res.data[0]);
        });
    }
  }, []);

  // Get Faults by trip id
  useEffect(() => {
    console.log("five");

    // Set CAS Count
    let autoBrkCount = 0;
    let harshAccCount = 0;
    let sleepAltCount = 0;
    let laneChngCount = 0;
    let spdBumpCount = 0;
    let suddenBrkCount = 0;
    let tailgatingCount = 0;
    let overspeedCount = 0;
    let accSavedCount = 0;
    let alarm1Count = 0;
    let alarm2Count = 0;

    // DMS data
    let drowsinessCount = 0;
    let tripstartCount = 0;
    let distractionCount = 0;
    let overspdCount = 0;
    let noSeatbeltCount = 0;
    let usingMobCount = 0;
    let unknownDriverCount = 0;
    let noDriverCount = 0;
    let smokingCount = 0;
    let rashDrivingCount = 0;
    let accidentCount = 0;

    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/ongoingTrip/getOngoingFaultByTripId/${id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((response) => {
        const faultData = response.data;

        let mediaData = []; // dms media data

        faultData.forEach((item) => {
          let jsonDataa = JSON.parse(item.jsondata);

          // Braking data
          if (item.event === "BRK") {
            autoBrkCount++; // Set automatic braking count

            let ttcdiff = jsonDataa.data.on_ttc - jsonDataa.data.off_ttc;
            let acd = ttcdiff / jsonDataa.data.off_ttc;
            let accSvd = acd * 100;
            if (accSvd > 50 && accSvd < 100) {
              accSavedCount++; // Set accident saved count
            }
          }

          // Notification data
          if (item.event === "NTF" && jsonDataa.notification === 2) {
            harshAccCount++;
          }
          if (item.event === "NTF" && jsonDataa.notification === 13) {
            sleepAltCount++;
          }
          if (item.event === "NTF" && jsonDataa.notification === 5) {
            laneChngCount++;
          }
          if (item.event === "NTF" && jsonDataa.notification === 4) {
            spdBumpCount++;
          }
          if (item.event === "NTF" && jsonDataa.notification === 3) {
            suddenBrkCount++;
          }
          if (item.event === "NTF" && jsonDataa.notification === 6) {
            tailgatingCount++;
          }
          if (item.event === "NTF" && jsonDataa.notification === 7) {
            overspeedCount++;
          }

          // Set Alarm data
          if (item.event === "ALM" && jsonDataa.data.alarm === 2) {
            alarm1Count++;
          }
          if (item.event === "ALM" && jsonDataa.data.alarm === 3) {
            alarm2Count++;
          }

          // DMS data
          if (item.event === "DMS") {
            mediaData.push(jsonDataa.data.media);
          }
          if (
            item.event === "DMS" &&
            jsonDataa.data.alert_type === "DROWSINESS"
          ) {
            drowsinessCount++;
          }
          if (
            item.event === "DMS" &&
            jsonDataa.data.alert_type === "TRIP_START"
          ) {
            tripstartCount++;
          }
          if (
            item.event === "DMS" &&
            jsonDataa.data.alert_type === "DISTRACTION"
          ) {
            distractionCount++;
          }
          if (
            item.event === "DMS" &&
            jsonDataa.data.alert_type === "OVERSPEEDING"
          ) {
            overspdCount++;
          }
          if (
            item.event === "DMS" &&
            jsonDataa.data.alert_type === "USING_PHONE"
          ) {
            usingMobCount++;
          }
          if (
            item.event === "DMS" &&
            jsonDataa.data.alert_type === "NO_SEATBELT"
          ) {
            noSeatbeltCount++;
          }
          if (
            item.event === "DMS" &&
            jsonDataa.data.alert_type === "UNKNOWN_DRIVER"
          ) {
            unknownDriverCount++;
          }
          if (
            item.event === "DMS" &&
            jsonDataa.data.alert_type === "NO_DRIVER"
          ) {
            noDriverCount++;
          }
          if (item.event === "DMS" && jsonDataa.data.alert_type === "SMOKING") {
            smokingCount++;
          }
          if (
            item.event === "DMS" &&
            jsonDataa.data.alert_type === "RASH_DRIVING"
          ) {
            rashDrivingCount++;
          }
          if (
            item.event === "DMS" &&
            jsonDataa.data.alert_type === "ACCIDENT"
          ) {
            accidentCount++;
          }
        });

        // Set CAS Count
        setAutoBrk(autoBrkCount);
        setHarshacc(harshAccCount);
        setSleepAlt(sleepAltCount);
        setLaneChng(laneChngCount);
        setSpdBump(spdBumpCount);
        setSuddenBrk(suddenBrkCount);
        setTailgating(tailgatingCount);
        setOverspeed(overspeedCount);
        setAccidentSaved(accSavedCount);
        setAlarm1(alarm1Count);
        setAlarm2(alarm2Count);

        // Set DMS count
        setMedia(mediaData);
        setDrowsiness(drowsinessCount);
        setDistraction(distractionCount);
        setDmsoverSpd(overspdCount);
        setNotSeatBelt(noSeatbeltCount);
        setUsePhone(usingMobCount);
        setUnknownDriver(unknownDriverCount);
        setNoDriver(noDriverCount);
        setSmoking(smokingCount);
        setRashDrive(rashDrivingCount);
        setDmsAccident(accidentCount);
        setTripStartAlert(tripstartCount);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [tripData]);

  // Set Iframe for DMS
  const dmsIframes = media.map((data) => {
    return (
      <div className="col-md-6 mb-2">
        <Iframe src={data} width="100%" height="300px"></Iframe>
      </div>
    );
  });

  // Customized Icon
  const liveIcon = {
    url: car,
  };
  const start = {
    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  };

  return (
    <>
      <Container className="my-3">
        <Link to="/ongoing-trips">
          <BsArrowLeft /> <small>Ongoing Trip list</small>
        </Link>
        <div className="mb-3">
          <p className="mb-0">
            Trip ID: <strong>{id}</strong>
          </p>
          <h4>{vehicle.vehicle_name} Ongoing Trip</h4>
        </div>

        {/* Google Map */}
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        >
          <GoogleMap
            mapContainerClassName="map-container"
            center={center}
            zoom={14}
          >
            <Marker position={startPoint} icon={start} className="liveIcon" />
            <Polyline path={path} />
            <Marker position={endPoint} icon={liveIcon} />
          </GoogleMap>
        </LoadScript>

        {/* Content Tabs */}
        <div className="mt-3 mb-5">
          <Tabs
            defaultActiveKey="summary"
            id="justify-tab-example"
            className="mb-3"
            justify
          >
            {/* Trip summary tab */}
            <Tab eventKey="summary" title="Trip Summary">
              <div className="row">
                <div className="col-md-4">
                  <div className="d-flex my-3">
                    <div className="text-center">
                      <span className="h2 text-muted">
                        <BsPinMapFill className="text-success" />
                      </span>
                    </div>
                    <div className="px-4">
                      <p className="mb-0 text-muted">
                        <small>
                          <em>Source</em>
                        </small>
                      </p>
                      <p className="mb-0">{startAddress}</p>
                      <span>
                        <small>
                          <strong>{startTime}</strong>
                        </small>
                      </span>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex my-3">
                    <div className="text-center">
                      <span className="h2 text-muted">
                        <BsPinMapFill className="text-warning" />
                      </span>
                    </div>
                    <div className="px-4">
                      <p className="mb-0 text-muted">
                        <small>
                          <em>Current Location</em>
                        </small>
                      </p>
                      <p className="mb-0">{endAddress}</p>
                      <span>
                        <small>{/* <strong>{lastTime}</strong> */}</small>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-header">
                      <strong>Trip Ananlytics</strong>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-3 mb-3">
                          <p className="mb-0">
                            <strong>Total Distance</strong>
                          </p>
                          {/* <p>{distance} KM</p> */}
                        </div>
                        <div className="col-sm-3 mb-3">
                          <p className="mb-0">
                            <strong>Travelled Time</strong>
                          </p>
                          {/* <p>{duration}</p> */}
                        </div>
                        {/* <div className="col-sm-3 mb-3">
                        <p className="mb-0">
                          <strong>Halt</strong>
                        </p>
                        <p>3 Min</p>
                      </div> */}
                        <div className="col-sm-3 mb-3">
                          <p className="mb-0">
                            <strong>Average Speed</strong>
                          </p>
                          {/* <p>{avgSpd} m/s</p> */}
                        </div>
                        <div className="col-sm-3 mb-3">
                          <p className="mb-0">
                            <strong>Max speed</strong>
                          </p>
                          {/* <p>{maxSpd} Kmph</p> */}
                        </div>
                        {/* <div className="col-sm-3 mb-3">
                        <p className="mb-0">
                          <strong>Braking Freq</strong>
                        </p>
                        <p>3 Min</p>
                      </div>
                      <div className="col-sm-3 mb-3">
                        <p className="mb-0">
                          <strong>Driver Score</strong>
                        </p>
                        <p>40 Kmph</p>
                      </div>
                      <div className="col-sm-3 mb-3">
                        <p className="mb-0">
                          <strong>Driver Incentive</strong>
                        </p>
                        <p>0</p>
                      </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>

            {/* Fault count tab */}
            <Tab eventKey="fault" title="Fault Counts">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card mb-3">
                    <div className="card-header">
                      <strong>CAS</strong>
                    </div>
                    <div className="card-body">
                      <ListGroup>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="cas1">
                              <Form.Check
                                type="checkbox"
                                label="Automatic Braking"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {autoBrk}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="cas2">
                              <Form.Check
                                type="checkbox"
                                label="Accident Saved"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {accidentSaved}
                          </Badge>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </div>

                  <div className="card mb-3">
                    <div className="card-header">
                      <strong>Sleep Alert</strong>
                    </div>
                    <div className="card-body">
                      <ListGroup>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="sl1">
                              <Form.Check
                                type="checkbox"
                                label="Sleep Alert Missed"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {sleeptAlt}
                          </Badge>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="card">
                    <div className="card-header">
                      <strong>Driver Evaluation</strong>
                    </div>
                    <div className="card-body">
                      <ListGroup>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="de1">
                              <Form.Check
                                type="checkbox"
                                label="Harsh Acceleration"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {harshacc}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="de2">
                              <Form.Check
                                type="checkbox"
                                label="Lane Change"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {laneChng}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="de3">
                              <Form.Check
                                type="checkbox"
                                label="Speed Bump"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {spdBump}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="de4">
                              <Form.Check
                                type="checkbox"
                                label="Sudden Braking"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {suddenBrk}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="de5">
                              <Form.Check
                                type="checkbox"
                                label="Tailgating"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {tailgating}
                          </Badge>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="card mb-3">
                    <div className="card-header">
                      <strong>Speed Governer</strong>
                    </div>
                    <div className="card-body">
                      <ListGroup>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="sg1">
                              <Form.Check
                                type="checkbox"
                                label="Overspeeding"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {overspeed}
                          </Badge>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <strong>Alarm Data</strong>
                    </div>
                    <div className="card-body">
                      <ListGroup>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <Form.Group className="" controlId="alr1">
                            <Form.Check
                              disabled="disabled"
                              type="checkbox"
                              label="Alarm 2"
                              value={5}
                              data-custom-attribute="ALM2"
                            />
                          </Form.Group>
                          <Badge bg="primary" pill>
                            {alarm1}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <Form.Group className="" controlId="alr2">
                            <Form.Check
                              disabled="disabled"
                              type="checkbox"
                              label="Alarm 3"
                              value={5}
                              data-custom-attribute="ALM3"
                            />
                          </Form.Group>
                          <Badge bg="primary" pill>
                            {alarm2}
                          </Badge>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>

            {/* DMS */}
            <Tab eventKey="dms" title="Trip Media">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card">
                    <div className="card-header">
                      <strong>DMS</strong>
                    </div>
                    <div className="card-body">
                      <ListGroup>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="dms11">
                              <Form.Check
                                type="checkbox"
                                label="Trip Start"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {tripStartAlert}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="dms1">
                              <Form.Check
                                type="checkbox"
                                label="Drowsiness"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {drowsiness}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="dms2">
                              <Form.Check
                                type="checkbox"
                                label="Distraction"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {distraction}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="dms3">
                              <Form.Check
                                type="checkbox"
                                label="Overspeeding"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {dmsoverSpd}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="dms4">
                              <Form.Check
                                type="checkbox"
                                label="No Seatbelt"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {noSeatbelt}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="dms5">
                              <Form.Check
                                type="checkbox"
                                label="Using Phone"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {usePhone}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="dms6">
                              <Form.Check
                                type="checkbox"
                                label="Unknown Driver"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {unknownDriver}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="dms7">
                              <Form.Check
                                type="checkbox"
                                label="No Driver"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {noDriver}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="dms8">
                              <Form.Check
                                type="checkbox"
                                label="Smoking"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {smoking}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="dms9">
                              <Form.Check
                                type="checkbox"
                                label="Rash Driving"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {rashDrive}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start border-0"
                        >
                          <div className="ms-2 me-auto">
                            <Form.Group className="" controlId="dms10">
                              <Form.Check
                                type="checkbox"
                                label="Accident"
                                disabled
                              />
                            </Form.Group>
                          </div>
                          <Badge bg="primary" pill>
                            {dmsAccident}
                          </Badge>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <h5>DMS Media</h5>
                  <div className="row">{dmsIframes}</div>
                </div>
              </div>
            </Tab>

            {/* Trip Details Vehicle and Driver */}
            <Tab eventKey="details" title="Trip Details">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-header">Vehicle Details</div>
                    <div className="card-body">
                      <p>
                        <strong>Vehicle Name:</strong> {vehicle.vehicle_name}
                      </p>
                      <p>
                        <strong>Registration Number:</strong>{" "}
                        {vehicle.vehicle_registration}
                      </p>
                      <p>
                        <strong>ECU:</strong> {vehicle.ecu}
                      </p>
                      <p>
                        <strong>IoT:</strong> {vehicle.iot}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </Container>
    </>
  );
};

export default OngoingTripView;
