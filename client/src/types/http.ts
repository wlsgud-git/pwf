export interface HttpResponse<T> {
  status?: number;
  data: T | undefined;
}

export interface HttpRequest {
  headers?: HttpHeaders;
  body?: FormData;
  method: string;
}

export interface HttpHeaders {
  [key: string]: any;
}
