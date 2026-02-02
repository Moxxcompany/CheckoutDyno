import CryptoJs from "crypto-js";

const createEncryption = (content: any) => {
  const secretKey = process.env.NEXT_PUBLIC_CYPHER_KEY ?? "mysecretkey";
  const cipherText = CryptoJs.AES.encrypt(content, secretKey).toString();

  return cipherText;
};

export default createEncryption;
