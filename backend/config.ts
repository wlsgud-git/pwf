import dotenv from "dotenv";
dotenv.config();

const required = (key: string, defaultValue?: undefined) => {
  let value = process.env[key] || defaultValue;
  if (!value) throw new Error("해당 환경변수는 존재하지 않습니다");
  return value;
};

export let config = {
  https: {
    port: parseInt(required("PORT"), 8443),
    host: required("HOST"),
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

  jwt: {
    secret_key: required("JWT_SECRET_KEY"),
    access_expires: required("JWT_ACCESS_EXPIRES"),
    refresh_expires: required("JWT_REFRESH_EXPRIES"),
  },
};
