import dotenv from "dotenv";
dotenv.config();

const required = (key: string, defaultValue?: undefined) => {
  let value = process.env[key] || defaultValue;
  if (!value) throw new Error("해당 환경변수는 존재하지 않습니다");
  return value;
};

export let config = {
  http: {
    http_port: parseInt(required("HTTP_PORT")),
    http_host: required("HTTP_HOST"),

    https_port: parseInt(required("HTTPS_PORT")),
    https_host: required("HTTPS_HOST"),
  },

  database: {
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
    host: required("DB_HOST"),
    database: required("DB_DATABASE"),
    port: parseInt(required("DB_PORT")),
  },

  socket: {
    client_url: required("SOCKET_CLIENT_URL"),
  },

  secure: {
    salt: parseInt(required("SALT")),
  },

  nodemailer: {
    email: required("NODEMAIL_EMAIL"),
    password: required("NODEMAIL_PASSWORD"),
    port: parseInt(required("NODEMAIL_PORT")),
  },

  redis: {
    host: required("REDIS_HOST"),
    port: parseInt(required("REDIS_PORT")),
  },

  session: {
    session_expire: parseInt(required("SESSION_EXPIRE")),
  },
};
