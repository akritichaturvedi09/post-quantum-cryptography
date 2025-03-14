import { kyber } from "kyber-crystals";
import { Buffer } from "buffer";
const kyberKeyEncapsulation = async (publicKey) => {

  const {cyphertext,secret}= await kyber.encrypt(publicKey);
  
  const baseCypherText=Buffer.from(cyphertext).toString("base64");
  localStorage.setItem("kyberSecret",baseCypherText);
  return {cyphertext:baseCypherText};
};
export default kyberKeyEncapsulation;
