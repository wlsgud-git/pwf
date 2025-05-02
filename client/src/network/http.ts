import axios, { Axios, AxiosInstance } from "axios";

import { HttpRequest, HttpResponse } from "../types/http";

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
  }

  async axiosFetch<T>(
    url: string,
    options: HttpRequest
  ): Promise<HttpResponse<T>> {
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
      throw err;
    }
  }
}
