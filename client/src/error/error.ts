import axios from "axios";

export const AxiosError = (err: unknown) => {
  if (axios.isAxiosError(err)) return err.response?.data;
  else return err;
};
