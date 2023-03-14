import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import axios from "axios";

///Display customer list

const Users = () => {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/customers/getall`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setCustomerData(res.data.usersData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="mt-4">
      <Container className="py-5">
        <div className="d-flex justify-content-between">
          <div>
            <h4>Customers</h4>
            <div>Total:{customerData.length}</div>
          </div>
          <div>
            <div>
              <Button onClick={() => navigate("/users-add")} variant="dark">
                Add Customer
              </Button>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <Table striped>
            <thead>
              <tr>
                <th>SR.No</th>
                <th>first_name</th>
                <th>last_name</th>
                <th>username</th>
                <th>Email</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {customerData?.map((el, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{el.first_name}</td>
                    <td>{el.last_name}</td>
                    <td>{el.username}</td>
                    <td>{el.email}</td>
                    <td>
                      {el.status === 1 ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="danger">Deactive</Badge>
                      )}
                    </td>
                    <td>
                      <span>
                        <small>
                          <Link
                            to={`/users-edit/${el.user_id}`}
                            className="text-decnone"
                          >
                            <AiFillEdit
                              size={18}
                              className="text-dark mx-2 h4"
                            />
                          </Link>

                          <Link to={`/users-show/${el.user_id}`}>
                            <AiFillEye className="h5 text-dark" />
                          </Link>
                        </small>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default Users;
