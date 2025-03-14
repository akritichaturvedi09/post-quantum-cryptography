import React, { useState, useContext } from "react";
import context from "../context/SiteContext.js";
import Signimg from "../assets/20602853_6300958.svg";
import {useNavigate} from 'react-router-dom'
const SignUp = () => {
  const navigate = useNavigate();
  const { host,handleAlerts } = useContext(context);
  const [formData, setFormData] = useState({
    fullname: null,
    email: null,
    password: null,
  });
  const [loader, setLoader] = useState({
    load:false
  });
  const handleFormData = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    loader.load=true
    setLoader({...loader});
    try{const response = await fetch(`${host}/api/v1/user/registeruser`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
      }),
    });
    const data = await response.json();
    if(response.status=='201')
    {loader.load=false
    setLoader({...loader})
      navigate('/login')
  
    handleAlerts("User registered Successfully","success")
    }}
    catch(err){
      handleAlerts("Something went wrong","warning")
    }
    loader.load=false
    setLoader({...loader})

  };

  return (
    <>
      <div className="container px-4 px-lg-5 my-5">
        <div className="row gx-4 gx-lg-5 align-items-center">
          <div className="col-md-6">
            <img
              className="card-img-top mb-5 mb-md-0"
              src={Signimg}
              alt="..."
            />
          </div>
          <div className="col-md-6">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="mb-4">
                  <h3>
                    <strong>Sign Up</strong>
                  </h3>
                  {/* <p className="mb-4">
                    Enter your email and password to access your account
                  </p> */}
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-group first">
                    <label htmlFor="username">Full Name</label>
                    <input
                      onChange={handleFormData}
                      type="text"
                      className="form-control"
                      name="fullname"
                      style={{
                        outline: "none",
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        backgroundColor: "transparent !important",
                      }}
                    />
                  </div>
                  <div className="form-group first">
                    <label htmlFor="username">Email</label>
                    <input
                      onChange={handleFormData}
                      type="eamil"
                      className="form-control"
                      name="email"
                      style={{
                        outline: "none",
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        backgroundColor: "transparent !important",
                      }}
                    />
                  </div>
                  <div className="form-group last mb-4">
                    <label htmlFor="password">Password</label>
                    <input
                      onChange={handleFormData}
                      type="password"
                      className="form-control"
                      name="password"
                      style={{
                        outline: "none",
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        backgroundColor: "transparent !important",
                      }}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    {loader.load ? (
                      <button
                        disabled
                        className="btn text-white btn-block btn-warning"
                        style={{ width: "100%", color: "yellow" }}
                      >
                        <div class="spinner-border text-light" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn text-white btn-block btn-warning"
                        style={{ width: "100%", color: "yellow" }}
                      >
                        Sign Up
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
