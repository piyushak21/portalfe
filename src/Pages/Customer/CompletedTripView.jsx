import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { Container, Tabs, Tab, ListGroup, Badge, Form } from "react-bootstrap";
import { BsPinMapFill, BsArrowLeft } from "react-icons/bs";
import Iframe from "react-iframe";
import markerImage from "../../Assets/icons/marker.svg";

const CompletedTripView = () => {
  // Get completed trip data
  let { id } = useParams();
  const [path, setPath] = useState([]);
  const [tripData, setTripData] = useState([]);
  const [center, setCenter] = useState({});
  const [startPoint, setStartPoint] = useState({});
  const [endPoint, setEndPoint] = useState({});
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [duration, setDuration] = useState("");
  const [spdData, setSpdData] = useState([]);
  const [media, setMedia] = useState({});
  const [dmsImg, setDmsImg] = useState("");
  const [dmsVid, setDmsVid] = useState("");
  const [dmsMedia, setDmsMedia] = useState("");
  const [accident, setAccident] = useState(0);
  const [harshacc, setHarshacc] = useState(0);
  const [sleeptAlt, setSleepAlt] = useState(0);
  const [laneChng, setLaneChng] = useState(0);
  const [spdBump, setSpdBump] = useState(0);
  const [suddenBrk, setSuddenBrk] = useState(0);
  const [tailgating, setTailgating] = useState(0);
  const [overspeed, setOverspeed] = useState(0);
  const [drowsiness, setDrowsiness] = useState(0);
  const [distraction, setDistraction] = useState(0);
  const [vehicle, setVehicle] = useState([]);
  const [distance, setDistance] = useState("");
  const [maxSpd, setMaxSpd] = useState("");
  const [durationInSec, setDurationInSec] = useState();
  const [avgSpd, setAvgSpd] = useState();
  const [autoBrk, setAutoBrk] = useState(0);

  let token = localStorage.getItem("token");

  //   Set all trip analytics
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/completedTrip/getTripById/${id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setTripData(res.data);

        // Set Map center
        setCenter({
          lat: parseFloat(res.data[0].lat),
          lng: parseFloat(res.data[0].lng),
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
        const dataLength = res.data.length - 1;
        setEndPoint({
          lat: parseFloat(res.data[dataLength].lat),
          lng: parseFloat(res.data[dataLength].lng),
        });

        // Set Start time
        let sttime = res.data[0].timestamp;
        let updateStTime = new Date(sttime * 1000);
        setStartTime(updateStTime.toString());

        // Set End time
        let edtime = res.data[dataLength].timestamp;
        let updateEdTime = new Date(edtime * 1000);
        setEndTime(updateEdTime.toString());

        // Set the duration
        let difference = edtime - sttime;
        setDurationInSec(difference); // this is use for calculate the avg speed

        let hours = Math.floor(difference / 3600);
        difference = difference % 3600;

        let minutes = Math.floor(difference / 60);
        difference = difference % 60;
        let seconds = difference;
        if (hours > 0) {
          setDuration(
            hours + " hours " + minutes + " Mins " + seconds + " Sec"
          );
        } else {
          setDuration(minutes + " Mins " + seconds + " Sec");
        }

        // Calculate average speed
        setSpdData(res.data.map((speed) => speed.spd));

        // set DMS data
        for (let i = 0; i < res.data.length; i++) {
          // Set DMS Data
          if (res.data[i].event === "DMS") {
            setMedia(res.data[i].jsondata);
          }
          // Set accident saved data
          // if (res.data[i].event === "BRK") {
          //   let brk = JSON.parse(res.data[i].jsondata);
          //   let ttcdiff = brk.data.on_ttc - brk.data.off_ttc;
          //   let acd = ttcdiff / brk.data.off_ttc;
          //   let accSvd = acd * 100;
          //   if (accSvd > 50 && accSvd < 100) {
          //     setAccident(parseInt(accident) + 1);
          //   }
          //   if (brk.data.reason === 0) {
          //     setAutoBrk((prevCount) => prevCount + 1);
          //   }
          // }

          // Set all notifications data

          if (res.data[i].event === "NTF") {
            let ntfData = res.data[i].jsondata;
            let ntfparse = JSON.parse(ntfData);

            if (ntfparse.notification === 2) {
              setHarshacc((prev) => prev + 1);
            }
            if (ntfparse.notification === 13) {
              setSleepAlt((prev) => prev + 1);
            }
            if (ntfparse.notification === 5) {
              setLaneChng((prev) => prev + 1);
            }
            if (ntfparse.notification === 4) {
              setSpdBump((prev) => prev + 1);
            }
            if (ntfparse.notification === 3) {
              setSuddenBrk((prev) => prev + 1);
            }
            if (ntfparse.notification === 6) {
              setTailgating((prev) => prev + 1);
            }
            if (ntfparse.notification === 7) {
              setOverspeed((prev) => prev + 1);
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Set Address
  useEffect(() => {
    if (tripData.length > 0 && startPoint !== "" && endPoint !== "") {
      const getAddress = async (lat, lng, setAddress) => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        setAddress(data.results[0].formatted_address);
      };

      getAddress(startPoint.lat, startPoint.lng, setStartAddress);
      getAddress(endPoint.lat, endPoint.lng, setEndAddress);
    }
  }, [tripData]);

  // Set DMS media
  useEffect(() => {
    if (media.length > 0) {
      let mediaParse = JSON.parse(media);
      setDmsImg(mediaParse.data.img_url);
      setDmsVid(mediaParse.data.vid_url);
      setDmsMedia(mediaParse.data.media);
      console.log(dmsMedia);

      if (mediaParse.data.alert_type === "DROWSINESS") {
        setDrowsiness((prev) => prev + 1);
      }
      if (mediaParse.data.alert_type === "Distraction") {
        setDistraction((prev) => prev + 1);
      }
    }
  }, [media]);

  // Set vehicle data
  useEffect(() => {
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
  }, [tripData]);

  // Set total distance
  useEffect(() => {
    if (tripData.length > 0) {
      let distancefunc = (lat1, lng1, lat2, lng2) => {
        let R = 6371;
        let dLat = 0.0174533 * (lat1 - lat2);
        let dLng = 0.0174533 * (lng1 - lng2);
        let a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(0.0174533 * lat1) *
            Math.cos(0.0174533 * lat2) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        return d;
      };
      let sum = 0;
      for (let i = 0; i < path.length - 1; i++) {
        sum =
          sum +
          distancefunc(
            path[i].lat,
            path[i].lng,
            path[i + 1].lat,
            path[i + 1].lng
          );
      }
      setDistance(sum.toFixed(2));
    }
  }, [tripData]);

  // Set Maximum Speed
  useEffect(() => {
    if (tripData.length > 0) {
      const maxFloat = Math.max(...spdData);
      setMaxSpd(Math.round(maxFloat));
    }
  }, [tripData, spdData]);

  // Set Average Speed
  useEffect(() => {
    if (tripData.length > 0 && distance > 0 && durationInSec > 0) {
      const distanceInKM = parseFloat(distance);
      const distanceInMeter = distanceInKM * 1000; // meters
      const time = parseFloat(durationInSec); // seconds
      const averageSpeed = distanceInMeter / time; // meters per second
      //   console.log(averageSpeed / 1000);

      setAvgSpd(Math.round(averageSpeed));
    }
  }, [tripData, distance, durationInSec]);

  //   Set faultcount locations and data
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filterMarker, setFilterMarker] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/completedTrip/getFaultsByTripId/${id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((response) => {
        let parameters = [];
        let params = {};

        for (let l = 0; l < response.data.length; l++) {
          ////////////////parsing break json

          let parseJson = JSON.parse(response.data[l].jsondata);

          if (response.data[l].event == "BRK") {
            let ttcdiff = parseJson.data.on_ttc - parseJson.data.off_ttc;
            let acd = ttcdiff / parseJson.data.off_ttc;
            let accSvd = acd * 100;
            if (accSvd > 50 && accSvd < 100) {
              setAccident((prevCount) => prevCount + 1);
              params = {
                id: response.data[l].id,
                lat: parseFloat(response.data[l].lat),
                lng: parseFloat(response.data[l].lng),
                title: parseJson.notification,
                content: response.data[l].timestamp,
                message: response.data[l].message,
                event: response.data[l].event,
              };
              parameters.push(params);
            }
            setAutoBrk((prevCount) => prevCount + 1);
            params = {
              id: response.data[l].id,
              lat: parseFloat(response.data[l].lat),
              lng: parseFloat(response.data[l].lng),
              title: parseJson.notification,
              content: response.data[l].timestamp,
              message: response.data[l].message,
              event: response.data[l].event,
            };
            parameters.push(params);
          }

          ///////////////////////adding brk json to markers
          if (parseJson.notification !== undefined) {
            params = {
              id: response.data[l].id,
              lat: parseFloat(response.data[l].lat),
              lng: parseFloat(response.data[l].lng),
              title: parseJson.notification,
              content: response.data[l].timestamp,
              message: response.data[l].message,
              event: response.data[l].event,
            };
            parameters.push(params);
          }
          if (parseJson.event == "BRK") {
            params = {
              id: response.data[l].id,
              lat: parseFloat(response.data[l].lat),
              lng: parseFloat(response.data[l].lng),
              title: response.data[l].message,
              event: response.data[l].event,
            };
            parameters.push(params);
          }
        }
        setMarkers(parameters);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };
  const handlecheckbox = (e) => {
    const { value, dataset } = e.target;
    if (e.target.checked) {
      let x = [];
      console.log(dataset.customAttribute);
      markers.map((el) => {
        if (el.title == value && el.event == dataset.customAttribute) {
          x.push(el);
        }
      });
      setFilterMarker([...filterMarker, x]);
    } else {
      let y = [];
      [].concat(...filterMarker)?.map((el, ind) => {
        if (el.title !== value && el.event !== dataset.customAttribute) {
          y.push(el);
        }
      });
      setFilterMarker([y]);
    }
  };

  useEffect(() => {
    // console.log(markers);
    console.log(filterMarker);
  }, [markers, filterMarker]);

  // customized marker icons
  const markerIcons = {
    red: {
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      // scaledSize: new window.google.maps.Size(40, 40),
    },
    blue: {
      url: markerImage,
      // scaledSize: new window.google.maps.Size(30, 30),
    },
    green: {
      url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      // scaledSize: new window.google.maps.Size(40, 40),
    },
  };

  return (
    <Container className="my-3">
      <Link to="/completed-trips">
        <BsArrowLeft /> <small>Completed Trip list</small>
      </Link>
      <div className="mb-3">
        <h4>{vehicle.vehicle_name} Completed Trip</h4>
      </div>
      {/* <button onClick={handleShowMarkers}>
        {showMarkers ? "Hide markers" : "Show markers"}
      </button> */}
      {/* Google Map */}
      <LoadScript googleMapsApiKey="AIzaSyB3W_lCZn6WX-bJsVp0ar7Q0KJboGsKnPk">
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={12}
        >
          <Marker position={startPoint} icon={markerIcons.green} />

          {[].concat(...filterMarker)?.map((marker, index) => (
            <Marker
              key={`${marker.id}-${index}`}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => handleMarkerClick(marker)}
              icon={markerIcons.blue}
            >
              {selectedMarker === marker && (
                <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                  <div>
                    <h5>{marker.title}</h5>
                    {marker.content}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}

          <Polyline
            path={path}
            options={{
              strokeColor: "#4252E0", // Set the color of the polyline path
              strokeWeight: 4, // Set the stroke size of the polyline
            }}
          />
          <Marker position={endPoint} icon={markerIcons.red} />
        </GoogleMap>
      </LoadScript>

      {/* Content Tabs */}
      <div className="my-3">
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
                      <BsPinMapFill className="text-danger" />
                    </span>
                  </div>
                  <div className="px-4">
                    <p className="mb-0 text-muted">
                      <small>
                        <em>Destination</em>
                      </small>
                    </p>
                    <p className="mb-0">{endAddress}</p>
                    <span>
                      <small>
                        <strong>{endTime}</strong>
                      </small>
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
                        <p>{distance} KM</p>
                      </div>
                      <div className="col-sm-3 mb-3">
                        <p className="mb-0">
                          <strong>Travelled Time</strong>
                        </p>
                        <p>{duration}</p>
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
                        <p>{avgSpd} m/s</p>
                      </div>
                      <div className="col-sm-3 mb-3">
                        <p className="mb-0">
                          <strong>Max speed</strong>
                        </p>
                        <p>{maxSpd} Kmph</p>
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
                              disabled={autoBrk === 0}
                              type="checkbox"
                              label="Automatic Braking"
                              value={6}
                              data-custom-attribute="BRK"
                              onChange={handlecheckbox}
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
                              disabled={accident === 0}
                              type="checkbox"
                              label="Accident Saved"
                              value={6}
                              data-custom-attribute="BRK"
                              onChange={handlecheckbox}
                            />
                          </Form.Group>
                        </div>
                        <Badge bg="primary" pill>
                          {accident}
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
                              disabled={sleeptAlt === 0}
                              type="checkbox"
                              label="Sleep Alert Missed"
                              value={13}
                              data-custom-attribute="NTF"
                              onChange={handlecheckbox}
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
                              disabled={harshacc === 0}
                              type="checkbox"
                              label="Harsh Acceleration"
                              value={2}
                              data-custom-attribute="NTF"
                              onChange={handlecheckbox}
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
                              disabled={laneChng === 0}
                              type="checkbox"
                              label="Lane Change"
                              value={5}
                              data-custom-attribute="NTF"
                              onChange={handlecheckbox}
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
                              disabled={spdBump === 0}
                              type="checkbox"
                              label="Speed Bump"
                              value={4}
                              data-custom-attribute="NTF"
                              onChange={handlecheckbox}
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
                              disabled={suddenBrk === 0}
                              type="checkbox"
                              label="Sudden Braking"
                              value={3}
                              data-custom-attribute="NTF"
                              onChange={handlecheckbox}
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
                              disabled={tailgating === 0}
                              type="checkbox"
                              label="Tailgating"
                              value={6}
                              data-custom-attribute="NTF"
                              onChange={handlecheckbox}
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
                <div className="card">
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
                              disabled={overspeed === 0}
                              type="checkbox"
                              label="Overspeeding"
                              value={7}
                              data-custom-attribute="NTF"
                              onChange={handlecheckbox}
                            />
                          </Form.Group>
                        </div>
                        <Badge bg="primary" className="mx-1" pill>
                          {overspeed}
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
                          <Form.Group className="" controlId="dms1">
                            <Form.Check type="checkbox" label="Drowsiness" />
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
                            <Form.Check type="checkbox" label="Distraction" />
                          </Form.Group>
                        </div>
                        <Badge bg="primary" pill>
                          {distraction}
                        </Badge>
                      </ListGroup.Item>
                    </ListGroup>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <h5>DMS Media</h5>
                <div className="row">
                  <div className="col-md-6">
                    <img src={dmsImg} alt="" className="img-fluid w-100" />
                  </div>

                  <div className="col-md-6">
                    <video width="320" height="240" controls>
                      <source src={dmsMedia} type="video/mp4" controls />
                    </video>
                    {/* <Iframe
                      src="https://drive.google.com/file/d/1v3_3b2GUXEfamkdEbEZF1kfHHpqBYRzI/view?usp=drivesdk"
                      width="300px"
                      height="300px"
                    ></Iframe> */}
                  </div>
                </div>
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
                      <strong>Registration Number:</strong>
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
              {/* <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-header">Driver Details</div>
                  <div className="card-body">
                    <p>
                      <strong>Driver Name:</strong> Ramu
                    </p>
                    <p>
                      <strong>Licence Number:</strong> KHD9278932
                    </p>
                    <p>
                      <strong>Contact Number:</strong> +91-39833-32983
                    </p>
                    <p>
                      <strong>Email ID:</strong> driver@stk.com
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
};

export default CompletedTripView;
