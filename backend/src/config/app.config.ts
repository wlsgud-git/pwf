import fs from "fs";
import path from "path";

export const httpsOption = {
  key: fs.readFileSync(path.resolve(__dirname, "../../cert/key.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "../../cert/cert.pem")),
};
