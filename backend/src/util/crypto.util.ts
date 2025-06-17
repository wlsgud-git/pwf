import bcrypt from "bcrypt";
import { config } from "../config/env.config";

// 해쉬 완료된 text return
export const hashingText = async (text: string) => {
  try {
    let hashText = await bcrypt.hash(text, config.secure.salt);
    return hashText;
  } catch (err) {
    throw err;
  }
};

// 비교 결과 return
export const compareText = async (
  text: string,
  hash_text: string
): Promise<boolean> => {
  try {
    let hashText = await bcrypt.compare(text, hash_text);
    return hashText;
  } catch (err) {
    throw err;
  }
};
