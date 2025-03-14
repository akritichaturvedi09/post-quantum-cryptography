import { Buffer } from "buffer";
async function decryptAES() {
    // Convert Base64 strings to Uint8Array
    const sharedSecret = localStorage.getItem("kyberSecret");
    const rawEncryptedData=localStorage.getItem("encryptedData");
    const parsedEncryptedData=JSON.parse(rawEncryptedData);

    const encryptedAesKey = new Uint8Array(Buffer.from(parsedEncryptedData.encryptedAesKey, "base64"));
    const authTag = new Uint8Array(Buffer.from(parsedEncryptedData.authTag, "base64"));
    const iv = new Uint8Array(Buffer.from(parsedEncryptedData.iv, "base64"));
    const sharedSecretKeyUint8 = new Uint8Array(Buffer.from(sharedSecret, "base64"));
    // Convert shared secret into a CryptoKey for AES decryption
    console.log(sharedSecretKeyUint8)
    const aesKeyBuffer = await window.crypto.subtle.digest('SHA-256', sharedSecretKeyUint8);
    const derivedKey = new Uint8Array(aesKeyBuffer);
    console.log(aesKeyBuffer)

    const aesKey = await window.crypto.subtle.importKey(
        "raw",
        derivedKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
    );
    try {
        // Decrypt the AES key
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
                tagLength: 128, // Make sure this matches your backend's tag length
            },
            aesKey,
            encryptedAesKey
        );

        return new TextDecoder().decode(decrypted); // Convert to string
    } catch (error) {
        console.error("AES Decryption failed:", error);
        return null;
    }
}
export default decryptAES;

