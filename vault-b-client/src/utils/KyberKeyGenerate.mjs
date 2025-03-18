import { kyber } from "kyber-crystals";
import { Buffer } from "buffer";
const kyberKeyEncapsulation = async (publicKey) => {
  const publicKeyUint8 = new Uint8Array(Buffer.from(publicKey, "base64"));
  const {cyphertext,secret}= await kyber.encrypt(publicKeyUint8);
  console.log("secret",secret)
  const baseCypherText=Buffer.from(cyphertext).toString("base64");
  const baseSecret=Buffer.from(secret).toString("base64");
  localStorage.setItem("kyberSecret",baseSecret);
  return {cyphertext:baseCypherText};
};
export default kyberKeyEncapsulation;
