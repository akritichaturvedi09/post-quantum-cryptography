import React from 'react'
// import '../css/Spinner.css'
import imgsrc from "../assets/spinner.svg"
function Spinner() {
  return (
    <div className="container2"  >
        <div className="d-flex justify-content-center align-items-center">
	<img src={imgsrc} alt="..." />
	</div>
</div>
  )
}

export default Spinner