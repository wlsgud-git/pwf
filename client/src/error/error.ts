import axios from "axios";

export const errorHandling = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    if (err.response) return err.response.data;
    else if (err.request) return alert("네트워크 에러!!!");
  } else return err;
};
