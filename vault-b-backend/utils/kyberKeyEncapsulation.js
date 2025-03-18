import pkg from 'kyber-crystals';
const {kyber} = pkg;
const kyberKeyEncapsulation = async () => {
    const keyPair = await kyber.keyPair();
    console.log(keyPair)
    const formatedKyberData={
        publicKey:Buffer.from(keyPair.publicKey).toString("base64"),
        privateKey:Buffer.from(keyPair.privateKey).toString("base64")
      }
    return {formatedKyberData};
}
export default kyberKeyEncapsulation;
