import { CorsOptions } from "cors";
import { config } from "./env.config";

export const corsOption: CorsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: config.https.client_host,
  // methods: ["get", "post"],
};
