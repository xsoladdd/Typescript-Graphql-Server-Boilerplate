import { config } from "dotenv";
import CryptoJS from "crypto-js";
config();

export const encrypt = (normalString: string): string => {
  //   const cryptr = new Cryptr("20140023");
  const ciphertext = CryptoJS.AES.encrypt(
    normalString,
    process.env.SECRET_KEY as string
  ).toString();
  return ciphertext;
};

export const decrypt = (encryptedString: string): string => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedString,
    process.env.SECRET_KEY as string
  );
  return bytes.toString(CryptoJS.enc.Utf8);
};
