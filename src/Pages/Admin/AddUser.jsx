import { useState } from "react";
import { Container, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import axios from "axios";

//Customer Add Component

const AddUser = () => {
  const [data, setData] = useState([]);

  let token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.password.length > 6) {
      alert("Password Should be of length 6");
    } else {
      if (
        data.first_name &&
        data.last_name &&
        data.username &&
        data.email &&
        data.password &&
        data.status
      ) {
        axios
          .post(`${process.env.REACT_APP_BASE_URL}/customers/add-user`, data, {
            headers: { authorization: `bearer ${token}` },
          })
          .then((res) => {
            console.log(res);
            alert("User Added SuccessFully");
          })
          .catch((err) => {
            console.log(err);
            alert("Error in addingData");
          });
      } else {
        alert("Fill all the Credentials");
      }
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div>
                <Link to="/users">&#8592; Customers</Link>
                <h4>Add Customers</h4>
              </div>
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="">First Name</label>
                    <InputGroup onChange={handleChange}>
                      <Form.Control name="first_name" type="text" />
                    </InputGroup>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="">Last Name</label>
                    <InputGroup onChange={handleChange}>
                      <Form.Control name="last_name" type="text" />
                    </InputGroup>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="">Username</label>
                    <InputGroup onChange={handleChange}>
                      <Form.Control name="username" type="text" />
                    </InputGroup>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="">Email ID</label>
                    <InputGroup onChange={handleChange}>
                      <Form.Control type="email" name="email" />
                    </InputGroup>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="">Password</label>
                    <InputGroup onChange={handleChange}>
                      <Form.Control
                        type="password"
                        minLength={6}
                        name="password"
                      />
                    </InputGroup>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="">Status</label>
                    <Form.Select onChange={handleChange} name="status">
                      <option>-Select Status-</option>
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
    </Container>
  );
};

export default AddUser;
