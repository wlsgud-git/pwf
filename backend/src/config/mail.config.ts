import nodemailer from "nodemailer";
import { config } from "./env.config";

export let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: config.nodemailer.port,
  secure: false,
  auth: {
    user: config.nodemailer.email,
    pass: config.nodemailer.password,
  },
});
