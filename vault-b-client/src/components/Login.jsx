import React, { useState, useContext, useEffect } from "react";
import loginImg from "../assets/16693291_5796109.svg";
import context from "../context/SiteContext.js";
import Spinner from "./Spinner.jsx";
import FileCard from "./FileCard.jsx";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { Buffer } from "buffer";
import decryptAES from "../utils/decryptAes.js";
import kyberKeyEncapsulation  from "../utils/KyberKeyGenerate.mjs";
const Login = () => {


  const {
    host,
    walletAddress,
    setWalletAddress,
    handleAlerts,
    setLoginStat,
    displayData,
    setDisplayData,
  } = useContext(context);
  const [formData, setFormData] = useState({
    fullname: null,
    email: null,
    password: null,
  });
  const [loader, setLoader] = useState({
    load: false,
    sign: false,
  });
  const [apiData, setApiData] = useState({});
  // const [displayData, setDisplayData] = useState({
  //   data: null,
  // });
  const handleFormData = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!localStorage.getItem("data")) {
        loader.load = true;
        setLoader({ ...loader });
        
        
        
        const response = await fetch(`${host}/api/v1/user/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await response.json();
        console.log(data)
        if (response.status == "200") {
          localStorage.setItem("kyberPk",data.data.kyberPk);
          const {cyphertext}= await kyberKeyEncapsulation(data.data.kyberPk);
          console.log("in login cyphertext",cyphertext)
          const responseKyber = await fetch(`${host}/api/v1/user/kyber`, {
            method: "POST",
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              cyphertext: cyphertext,
            }),
          })
          const kyberData = await responseKyber.json();
          if(responseKyber.status=="200"){
            console.log("kyberData",kyberData)
            localStorage.setItem("encryptedData",JSON.stringify(kyberData.data));
          }
          const key = await decryptAES();
          console.log("key",key)
          connectWallet();
          loader.load = false;
          loader.sign = true;
          setLoader({ ...loader });
          setLoginStat(true);
          setApiData(data);
          localStorage.setItem("data", JSON.stringify(data));
          const response2 = await fetch(`${host}/api/v1/user/displayfile`, {
            method: "POST",
            credentials: "include",
          });
          const data2 = await response2.json();
          if (response2.status == "201") {
            loader.sign = false;
            setLoader({ ...loader });
            displayData.data = data2.data;
            setDisplayData({ ...displayData });
          }
          handleAlerts("User Logged In Successfully", "warning");
        }
      }
    } catch (err) {
      handleAlerts("something went bad / wrong credentials", "danger");
      console.log(err)
    }
    loader.load = false;
    setLoader({ ...loader });
  };

  useEffect(() => {
    if (localStorage.getItem("data")) {
      connectWallet();
      loader.sign = true;
      setLoader({ ...loader });
      async function display() {
        const response2 = await fetch(`${host}/api/v1/user/displayfile`, {
          method: "POST",
          credentials: "include",
        });
        const data2 = await response2.json();
        if (response2.status == "201") {
          loader.sign = false;
          setLoader({ ...loader });
          displayData.data = data2.data;
          setDisplayData({ ...displayData });
        }
        // console.log(displayData)
      }
      display();
    }
  }, []);
  // generate hash

  // web3

  const requestAccount = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setWalletAddress(accounts[0]);
        if (walletAddress === "null")
          handleAlerts(`Wallet Connected Successfully`, "success");
      } catch (error) {
        handleAlerts(`${error.message}`, "danger");
      }
    } else console.log("metamask does not exist");
  };

  async function connectWallet(event) {
    event && event.preventDefault();

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      // if (window.ethereum.networkVersion !== 11155111) {
      //         try{
      //           await window.ethereum.request({
      //             method: 'wallet_switchEthereumChain',
      //             params: [{ chainId: '0xaa36a7' }]
      //           });
      //         }
      //         catch(err){
      //             handleAlerts(`${err.message}`,'warning')
      //         }
      //         }

      //   const provider = new ethers.providers.Web3Provider(window.ethereum);
      const provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      handleAlerts("Please install MetaMask", "warning");
    }
  }

  return (
    <>
      {/* cards */}
      {localStorage.getItem("data") ? (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
            {/* <!-- Container wrapper --> */}
            <div className="container-fluid">
              {/* <!-- Toggle button --> */}
              <button
                data-mdb-collapse-init
                className="navbar-toggler"
                type="button"
                data-mdb-target="#navbarCenteredExample"
                aria-controls="navbarCenteredExample"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i className="fas fa-bars"></i>
              </button>

              {/* <!-- Collapsible wrapper --> */}
              <div
                className="collapse navbar-collapse justify-content-center"
                id="navbarCenteredExample"
              >
                {/* <!-- Left links --> */}
                <ul className="navbar-nav mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">
                      Home
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      type="button"
                      className="nav-link "
                      onClick={connectWallet}
                    >
                      {walletAddress !== "null"
                        ? "Wallet connected"
                        : "Connect wallet"}
                    </a>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link " to={"/history"}>
                      History
                    </Link>
                  </li>
                </ul>
                {/* <!-- Left links --> */}
              </div>
              {/* <!-- Collapsible wrapper --> */}
            </div>
            {/* <!-- Container wrapper --> */}
          </nav>
          <div className="container my-3  " style={{ minHeight: "100vh" }}>
            {loader.sign ? (
              <div className="d-flex justify-content-center align-iteams-center">
                {" "}
                <Spinner />
              </div>
            ) : (
              <div className=" container  ">
                <div className="row ">
                  {displayData.data && displayData.data[0] ? (
                    displayData.data?.map((obj) => {
                      return (
                        <div className="col-md-3 ml-5" key={obj.fileurl}>
                          <FileCard obj={obj} />
                        </div>
                      );
                    })
                  ) : (
                    <div
                      className="d-flex justify-content-center align-iteams-center"
                      style={{ marginTop: "10rem" }}
                    >
                      <h1>Start uploading</h1>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <img
                className="card-img-top mb-5 mb-md-0"
                src={loginImg}
                alt="..."
              />
            </div>
            <div className="col-md-6">
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <div className="mb-4">
                    <h3>
                      <strong>Sign In</strong>
                    </h3>
                    {/* <p className="mb-4">
                    Enter your email and password to access your account
                  </p> */}
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group first">
                      <label htmlFor="username">Email</label>
                      <input
                        required
                        onChange={handleFormData}
                        type="email"
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
                        required
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
                          <div
                            className="spinner-border text-light"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn text-white btn-block btn-warning"
                          style={{ width: "100%", color: "yellow" }}
                        >
                          Login
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
