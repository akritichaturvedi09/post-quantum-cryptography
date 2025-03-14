import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteState from "./context/SiteState.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import Alerts from "./components/Alerts.jsx";
import History from "./components/History.jsx";
import About from "./components/About.jsx";
import Footer from "./components/Footer.jsx";
// import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SiteState>
        <BrowserRouter>
        <Navbar />
        <Alerts/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/about" element={<About/>}/>

        </Routes>
        <Footer/>
        </BrowserRouter>
      </SiteState>
    </>
  );
}

export default App;
