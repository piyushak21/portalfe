import React from "react";
import error from "../Assets/img/404.png";

export const NotFound = () => {
  return (
    <div>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card text-center border-0">
              <div className="card-body">
                <h1 className="display-4 text-danger">
                  <b>OOPS!</b>
                </h1>
                <img src={error} alt="404 error" className="img-fluid" />
                <h4 className="text-muted">404 Not Found</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
