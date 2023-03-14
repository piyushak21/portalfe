import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { FaUser } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import styles from "../../CSS/ShowUser.module.css";

const ShowUser = () => {
  const { user_id } = useParams();
  const token = localStorage.getItem("token");
  const [custoData, setCustoData] = useState(["Starkenn"]);

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
  }, []);

  return (
    <Container>
      <div>
        <Link to="/users">Customer</Link>
      </div>
      <div className={styles.maindiv}>
        <div>
          <span>
            <FaUser size={50} />
          </span>
        </div>
        <div>
          <h5>{custoData[0].username}</h5>
          <p>
            <strong>First Name:</strong>
            {custoData[0].first_name}
          </p>
          <p>
            <strong>Last Name:</strong>
            {custoData[0].last_name}
          </p>
          <p>
            <strong>Email:</strong>
            {custoData[0].email}
          </p>
        </div>
      </div>
    </Container>
  );
};

export default ShowUser;
