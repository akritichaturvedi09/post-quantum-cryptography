import SiteContext from "./SiteContext";
import { useState } from "react";
const SiteState = (Props)=>{
  const [walletAddress,setWalletAddress]=useState(null)
  const contractAdd='0x4eD4Da2DDa2ABD05dBFaFcf79134442f73CA82e8'
  const [displayData, setDisplayData] = useState({
    data: null,
  });
  // https://vault-b.vercel.app
  
    const host="http://localhost:3001"
    const [loginStat,setLoginStat]=useState(false)
    const [alerts,setAlerts]=useState(null);
    const handleAlerts=(msg,typo)=>{
        setAlerts({
          message:msg,
          alertType:typo
        }
        )
        setTimeout(()=>{
          setAlerts(null)
        },3000)
      }

    return(
        <SiteContext.Provider value={{host,contractAdd,walletAddress,displayData,handleAlerts,alerts,loginStat,setLoginStat,setDisplayData,setWalletAddress}}>
            {Props.children}
        </SiteContext.Provider>
    )
}
export default SiteState