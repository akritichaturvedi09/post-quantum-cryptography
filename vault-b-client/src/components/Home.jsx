import React,{useContext} from "react";
import {Link} from "react-router-dom"
import homeimg from "../assets/8961375_4035610.svg";
import context from '../context/SiteContext.js'
const Home = () => {
  const {loginStat}=useContext(context)
  return (
    <>
      
      <section >
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <img
                className="card-img-top mb-5 mb-md-0"
                src={homeimg}
                alt="..."
              />
              
            </div>
            <div className="col-md-6">
              <h1 className="display-5 fw-bolder">{"Vault-B (E-Vault) Powered by Block Chain"}</h1>
              
              <p className="lead">
              Ready to safeguard your digital assets? Explore our blockchain-based e-vault today
              </p>
              <div className="d-flex">
                
                <button
                  className="btn btn-warning flex-shrink-0"
                  type="button"
                >
                  {localStorage.getItem('data')||loginStat?<Link  to="/login" style={{textDecoration:"none",color:"black"}}>Got to Dashboard</Link>:
                  <Link className="bi-cart-fill me-1" to="/signup" style={{textDecoration:"none",color:"black"}}>Sign Up</Link>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
};
export default Home;
