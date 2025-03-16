import crypto from "crypto"; // For ES module
const AesKeyEncryption = async (kyberAesKey,userAesKey) => {
  const userAesKeyBuffer = Buffer.from(userAesKey, "base64");
  const iv = crypto.randomBytes(16); // AES-GCM requires IV
  const cipher = crypto.createCipheriv("aes-256-gcm", kyberAesKey, iv);
  let encryptedAesKey = cipher.update(userAesKeyBuffer);
  encryptedAesKey = Buffer.concat([encryptedAesKey, cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Send these to the server
  const encryptedData = {
    encryptedAesKey: encryptedAesKey.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
  console.log("shared secret aes base64",Buffer.from(kyberAesKey).toString("base64"))
    return {encryptedData};
};
export default AesKeyEncryption
