import React, { useEffect, useState } from "react";
import { Container, Tabs, Tab, Form, InputGroup } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const EditUser = () => {
  const { user_id } = useParams();
  const [data, setData] = useState([]);
  const [idData, setIdData] = useState(["Starkenn"]);
  const [master_customer, setMaster_customer] = useState(["Master_customer"]);
  const [isData, setIsData] = useState(false);
  const [putData, setPutData] = useState([]);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handlemasterChange = (e) => {
    let { name, value } = e.target;
    setPutData({ ...putData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.password && data.status) {
      if (data.password.length > 6) {
        alert("Password should be of length 6");
      }
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/customers/edit-user/${user_id}`,
          data,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          console.log(res);
          alert("User Updated Successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("fill all required credentials");
    }
  };

  ///get Data

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/customers/get-user/${user_id}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setIdData(res.data.IdData);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/customers/getall/${user_id}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setMaster_customer(res.data.getData);
        if (res.data.getData.length > 0) {
          setIsData(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  ///Master Customer

  const handleMasterSubmit = (e) => {
    e.preventDefault();
    console.log(master_customer.length);
    if (master_customer.length > 0) {
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/customers/edit-customer/${master_customer[0].customer_id}`,
          putData,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          console.log(res);
          alert("Data Updated Successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Hello");
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/customers/add-customer/${user_id}`,
          putData,
          {
            headers: { authorization: `bearer ${token}` },
          }
        )
        .then((res) => {
          console.log(res);
          alert("Data Added Successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <div>
        <Link to="/users">&#8592; Customers</Link>
        <h4>Edit Customer</h4>
      </div>

      <div className="my-4">
        <Tabs
          defaultActiveKey="auth"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="auth" title="Customer Details">
            <div className="row">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="">
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="">First Name</label>
                          <InputGroup onChange={handleChange}>
                            <Form.Control
                              defaultValue={idData[0].first_name}
                              name="first_name"
                            />
                          </InputGroup>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="">Last Name</label>
                          <InputGroup onChange={handleChange}>
                            <Form.Control
                              defaultValue={idData[0].last_name}
                              name="last_name"
                            />
                          </InputGroup>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="">Username</label>
                          <InputGroup onChange={handleChange}>
                            <Form.Control
                              defaultValue={idData[0].username}
                              name="username"
                            />
                          </InputGroup>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="">Email ID</label>
                          <InputGroup onChange={handleChange}>
                            <Form.Control
                              defaultValue={idData[0].email}
                              name="email"
                              type="email"
                            />
                          </InputGroup>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="">Status</label>
                          <Form.Select onChange={handleChange} name="status">
                            <option>
                              {idData[0]?.status == 1 ? "Active" : "Deactive"}
                            </option>
                            <option value="0">Deleted</option>
                            <option value="1">Active</option>
                            <option value="2">Deactive</option>
                          </Form.Select>
                        </div>

                        <div className="text-center">
                          <button
                            className="btn btn-theme w-100 btn-lg"
                            type="submit"
                          >
                            SUBMIT
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>

          <Tab eventKey="other" title="Other Details">
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={handleMasterSubmit}>
                      <div className="mb-3">
                        <label htmlFor="">Company Name</label>
                        <InputGroup onChange={handlemasterChange}>
                          <Form.Control
                            type="text"
                            defaultValue={master_customer[0]?.company_name}
                            name="company_name"
                          />
                        </InputGroup>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="">Address</label>
                        <InputGroup onChange={handlemasterChange}>
                          <Form.Control
                            type="text"
                            defaultValue={master_customer[0]?.address}
                            name="address"
                          />
                        </InputGroup>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="">State</label>
                        <InputGroup onChange={handlemasterChange}>
                          <Form.Control
                            type="text"
                            defaultValue={master_customer[0]?.state}
                            name="state"
                          />
                        </InputGroup>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="">City</label>
                        <InputGroup onChange={handlemasterChange}>
                          <Form.Control
                            defaultValue={master_customer[0]?.city}
                            name="city"
                            type="text"
                          />
                        </InputGroup>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="">Pincode</label>
                        <InputGroup onChange={handlemasterChange}>
                          <Form.Control
                            defaultValue={master_customer[0]?.pincode}
                            name="pincode"
                            maxLength={6}
                          />
                        </InputGroup>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="">Contact Number</label>
                        <InputGroup onChange={handlemasterChange}>
                          <Form.Control
                            defaultValue={master_customer[0]?.phone}
                            name="phone"
                            maxLength={10}
                          />
                        </InputGroup>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="">Status</label>
                        <Form.Select
                          onChange={handlemasterChange}
                          name="status"
                        >
                          <option>
                            {master_customer[0]?.status == 1
                              ? "Active"
                              : "Deactive"}
                          </option>{" "}
                          <option value="0">Deleted</option>
                          <option value="1">Active</option>
                          <option value="2">Deactive</option>
                        </Form.Select>
                      </div>
                      <div className="text-center">
                        <button
                          className="btn btn-theme w-100 btn-lg"
                          type="submit"
                        >
                          SUBMIT
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
};

export default EditUser;
