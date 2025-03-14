import React, { useEffect, useState ,useContext} from 'react'
import { ethers } from 'ethers'
import imageLocal from '../assets/no-image-icon-6.png'
import context from "../context/SiteContext.js"
import abi from '../abi/project.json'
export default function FileCard(Props) {
  const {walletAddress,contractAdd,handleAlerts}=useContext(context)
  const [previewUrl,setPreviewUrl]=useState(null);
  const generateFile = async ()=>{
    const response = await fetch(Props.obj.fileurl)
    const fileBuffer = await response.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    // const hash=await generateHash(fileBuffer)
    console.log(hashHex)
  }
  const verify = ()=>{
    handleAlerts('verified successfully','success')
  }
  // web3 addfile
  const fileAdd = async (event) => {
    event.preventDefault();
    if(window.ethereum){
      
    try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner(walletAddress)
        const addFile = new ethers.Contract(contractAdd, abi.abi, signer)
        await addFile.uploadFile('t','mouse')
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


useEffect(()=>{
  const url=Props.obj.filename;
  if(url.endsWith('.png')||url.endsWith('.svg')||url.endsWith('.gif')||url.endsWith('.jpg')||url.endsWith('.jpeg')||url.endsWith('.bmp'))
  setPreviewUrl(Props.obj.fileurl)
  else
  setPreviewUrl(imageLocal)
},[])

    return (

        // <div className="my-3">
        //     <div className="card  " style={{ width: "18rem",height:"18rem",overflow: "auto" }} >
        //         <img src={Props.obj.fileurl ? Props.obj.fileurl : imageLocal} className="card-img-top" style={{ height: "10rem", objectFit: "cover" }} alt="..." />
        //         <div className="card-body">
        //             <h5 className="card-title">{Props.obj.filename}</h5>
        //             {/* <p className="card-text">{Props.obj.description}</p> */}
                    
        //         </div>
        //         <a href={Props.obj.fileurl} target='_blank' className="btn btn-primary">Download File</a>
        //     </div>
            
        // </div>
        <div className="my-3">
  <div className="card" style={{ width: "18rem",height:"18rem", overflow: "auto" }}>
    <div style={{ maxHeight: "10rem", overflow: "hidden" }}>
      <img src={previewUrl} className="card-img-top" style={{ width: "100%", height: "auto" }} alt="..." />
    </div>
    <div className="card-body">
      <h5 className="card-title">{Props.obj.filename}</h5>
      {/* <p className="card-text">{Props.obj.description}</p> */}
      
    </div>
    <a href={Props.obj.fileurl} target='_blank' className="btn btn-warning">Download File</a>
    <button   className="btn btn-success" onClick={verify}>Verify</button>
  </div>
  
</div>





    )
}
