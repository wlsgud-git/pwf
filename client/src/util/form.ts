import { KeyObject } from "crypto";

export function createFormData(data: any): FormData {
  let formdata = new FormData();

  for (const key in data) {
    let value: any = data[key];
    let vt = typeof value;
    // object 형식
    if (vt == "object") {
      // 배열
      if (Array.isArray(value))
        value.map((val) => formdata.append(`${key}[]`, JSON.stringify(val)));
      else if (value instanceof File) formdata.append(key, value);
      else formdata.append(key, JSON.stringify(value));
    }
    // string 형식
    else if (vt == "string" || vt == "boolean") formdata.append(key, value);
    // 숫자
    else if (vt == "number") formdata.append(key, value.toString());
    else {
      return formdata;
    }
  }

  return formdata;
}
