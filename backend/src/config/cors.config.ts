import { CorsOptions } from "cors";
import { config } from "./env.config";

export const corsOption: CorsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: "https://pwf.vercel.app",
  // methods: ["get", "post"],
};
