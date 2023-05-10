import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { FaUser } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

const ShowUser = () => {
  const { user_id } = useParams();
  const token = localStorage.getItem("token");
  const [custoData, setCustoData] = useState(["Starkenn"]);
  const [customerDetail, setCustomerDetail] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/customers/get-user/${user_id}`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setCustoData(res.data.IdData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_id]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/customers/get-customer-details/${user_id}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setCustomerDetail(res.data.IdData);
        console.log(customerDetail);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_id]);

  return (
    <Container className="mt-4 mb-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div>
                <Link to="/users">&#8592; Customers</Link>
                <h4>Customer Details</h4>
                <hr />
              </div>
              <div className="row my-4">
                <div className="col-md-12">
                  {/* <div className="text-center">
                    <span>
                      <FaUser size={50} />
                    </span>
                  </div> */}
                  <p>
                    <strong>Customer Name: </strong>
                    {custoData[0].first_name} {custoData[0].last_name}
                  </p>
                  <p>
                    <strong>Email ID: </strong>
                    {custoData[0].email}
                  </p>
                  <p>
                    <strong>Company: </strong>
                    {customerDetail[0]?.company_name}
                  </p>
                  <p>
                    <strong>Address: </strong>
                    {customerDetail[0]?.address}
                  </p>
                  <p>
                    <strong>State: </strong>
                    {customerDetail[0]?.state}
                  </p>
                  <p>
                    <strong>City: </strong>
                    {customerDetail[0]?.city}
                  </p>
                  <p>
                    <strong>Pincode: </strong>
                    {customerDetail[0]?.pincode}
                  </p>
                  <p>
                    <strong>Contact: </strong>
                    {customerDetail[0]?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ShowUser;
