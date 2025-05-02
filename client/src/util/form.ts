export function createFormData<T>(data: T): FormData {
  let formdata = new FormData();

  for (const key in data) {
    let value: any = data[key];
    if (Array.isArray(value)) {
      value.map((val) => formdata.append(`${key}[]`, val));
    } else {
      formdata.append(key, value);
    }
  }

  return formdata;
}
