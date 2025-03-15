import { kyber } from "kyber-crystals";
import { Buffer } from "buffer";
const kyberKeyEncapsulation = async (publicKey) => {

  const {cyphertext,secret}= await kyber.encrypt(publicKey);
  console.log("secret",secret)
  const baseCypherText=Buffer.from(cyphertext).toString("base64");
  const baseSecret=Buffer.from(secret).toString("base64");
  localStorage.setItem("kyberSecret",baseSecret);
  return {cyphertext:baseCypherText};
};
export default kyberKeyEncapsulation;
