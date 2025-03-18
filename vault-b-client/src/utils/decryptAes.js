import { Buffer } from "buffer";
import cryptoBrowserify from 'crypto-browserify';
async function decryptAES() {
    // Convert Base64 strings to Uint8Array
    const sharedSecret = localStorage.getItem("kyberSecret");
    const rawEncryptedData=localStorage.getItem("encryptedData");
    const parsedEncryptedData=JSON.parse(rawEncryptedData);

    const encryptedAesKey = Buffer.from(parsedEncryptedData.encryptedAesKey, "base64")
    const authTag = new Uint8Array(Buffer.from(parsedEncryptedData.authTag, "base64"));
    const iv = new Uint8Array(Buffer.from(parsedEncryptedData.iv, "base64"));

    const sharedSecretKeyBuffer = Buffer.from(sharedSecret, "base64")
    // Convert shared secret into a CryptoKey for AES decryption
    
   
    const derivedKey=cryptoBrowserify.createHash('sha256')
    .update(sharedSecretKeyBuffer)
    .digest();
    console.log("derived shared key shared secret",derivedKey.toString('base64'))
    const decipher = cryptoBrowserify.createDecipheriv('aes-256-gcm', derivedKey, iv);
    decipher.setAuthTag(authTag);
    console.log(decipher)
    let decryptedUserKey = decipher.update(encryptedAesKey);
    console.log(decryptedUserKey.toString('base64'))
    decryptedUserKey = Buffer.concat([decryptedUserKey, decipher.final()]);
    console.log(decryptedUserKey.toString('base64'))
    
}
export default decryptAES;

