import axios, { Axios, AxiosError, AxiosInstance } from "axios";

import { store } from "../redux/store";
import { resetAllstate } from "../redux/actions/root.action";

type UnauthorizedHandler = () => void;
const unauthorizedHandlers: UnauthorizedHandler[] = [];

export const onUnauthorized = (handler: UnauthorizedHandler) =>
  unauthorizedHandlers.push(handler);

export class HttpClient {
  baseURL: string | undefined;
  client: AxiosInstance;
  constructor() {
    this.baseURL = process.env.REACT_APP_BASEURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError<any>) => {
        let status = error.response?.status;

        if (status === 401) {
          unauthorizedHandlers.forEach((fn) => fn());
        }

        return Promise.reject(error);
      }
    );
  }

  async axiosFetch<T>(url: string, options: any): Promise<any> {
    let { body, method, headers } = options;

    // 요청에 보낼 정보들
    let req = {
      url,
      method,
      data: body,
      headers: {
        ...headers,
      },
    };

    try {
      let res = await this.client(req);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
