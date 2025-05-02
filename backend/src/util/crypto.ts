import bcrypt from "bcrypt";
import { config } from "../../config";

export const hashingText = async (text: string) => {
  try {
    let hashText = await bcrypt.hash(text, config.secure.salt);
    return hashText;
  } catch (err) {
    throw err;
  }
};

export const compareText = async (
  text: string,
  hash_text: string
): Promise<boolean> => {
  try {
    let hashText = await bcrypt.compare(text, hash_text);
    return hashText;
  } catch (err) {
    console.log("in crypto:", err);
    throw err;
  }
};
