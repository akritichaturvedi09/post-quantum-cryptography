import React, { useContext, useEffect, useState, useRef } from "react";
import context from "../context/SiteContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import abi from '../abi/project.json'

const Navbar = () => {
  const ref = useRef(null);
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState(null);
  const [loader, setLoader] = useState({
    load: false,
    mod: false,
  });
  const [userData, setUserData] = useState({ data: null });
  const {
    walletAddress,
    contractAdd,
    loginStat,
    host,
    displayData,
    setDisplayData,
    handleAlerts,
    setLoginStat,
  } = useContext(context);
  const navigate = useNavigate();
  const handleLogout = async () => {
    const response = await fetch(`${host}/api/v1/user/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (response.status == "200") {
      setLoginStat(false);
      localStorage.clear();
      handleAlerts("logged out successfully", "warning");
      navigate("/");
    }
  };

  //   file upload

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    loader.load = true;
    setLoader({ ...loader });
    if (!file) {
      
      handleAlerts("No file selected", "warning");
      loader.load = false;
      setLoader({ ...loader });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${host}/api/v1/user/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (response.ok) {
      loader.load = false;
      setLoader({ ...loader });
      if (ref.current) {
        ref.current.click();
        const response2 = await fetch(`${host}/api/v1/user/displayfile`, {
          method: "POST",
          credentials: "include",
        });
        const data2 = await response2.json();
        if (response2.status == "201") {
          displayData.data = data2.data;
          setDisplayData({ ...displayData });
        }
      }
      handleAlerts("file uploaded successfully", "warning");
      const fileHash = await generateHash(file);
      setHash(fileHash)
      
      await fileAdd(fileHash);  
      
    }
    loader.load = false;
    setLoader({ ...loader });
  };

// generate hash
const generateHash = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const fileBuffer = event.target.result;
            const crypto = window.crypto || window.msCrypto;
            if (!crypto || !crypto.subtle || !crypto.subtle.digest) {
                reject('Crypto API not available');
                return;
            }
            const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
            resolve(hashHex);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}
// web3
const fileAdd = async (file_hash) => {
  
  if(window.ethereum){
    
  try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner(walletAddress)
      const addFile = new ethers.Contract(contractAdd, abi.abi, signer)
      
      await addFile.uploadFile(file.name,file_hash)
  }
  catch (err) {
      if (err.code === 'INVALID_ARGUMENT'&&String(err.value)==='NaN'){
          handleAlerts(`${err.code}: Serial Number must be a Number`, 'warning')
      }
      else 
          handleAlerts(`${err}`, 'warning')
       
  }

}
else
{handleAlerts('Please install MetaMask','warning')
} 
}


  useEffect(() => {
    let data;
    if (localStorage.getItem("data")) {
      data = JSON.parse(localStorage.getItem("data"));
      userData.data = data.data?.user;
      setUserData({ ...userData });
    }
  }, [loginStat]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container px-4 px-lg-5">
          <Link className="navbar-brand" to="/">
            Vault-B
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <li className="nav-item">
                <Link className="nav-link " aria-current="page" to={'/'}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={'/about'}>
                  About
                </Link>
              </li>
              
            </ul>
            <form className="d-flex">
              <div className="btn btn-warning">
                {localStorage.getItem("data") || loginStat ? (
                  <div className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      id="navbarDropdown"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ color: "black" }}
                    >
                      Account
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <p className="dropdown-item">
                          {userData.data?.fullname}
                        </p>
                      </li>
                      <li>
                        <p className="dropdown-item">{userData.data?.email}</p>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <p
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          Upload
                        </p>
                      </li>
                      <li>
                        <p className="dropdown-item" onClick={handleLogout}>
                          log out
                        </p>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link
                    className="bi-cart-fill me-1"
                    to="/login"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Login
                  </Link>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* modal */}
        <div
          className={`modal fade `}
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Upload Document
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form encType="multipart/form-data">
                <div className="modal-body d-flex justify-content-center">
                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">
                      Default name will be use
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      id="formFile"
                      name="file"
                      required
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    ref={ref}
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    style={{ width: "6rem", height: "3rem" }}
                  >
                    Close
                  </button>
                  {loader.load ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      //   data-bs-dismiss="modal"
                      style={{ width: "6rem", height: "3rem" }}
                    >
                      <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{ width: "6rem", height: "3rem" }}
                      //   data-bs-dismiss="modal"
                      onClick={handleSubmit}
                    >
                      Upload
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
