export function createFormData(data: any): FormData {
  let formdata = new FormData();

  for (const key in data) {
    let value: any = data[key];
    if (Array.isArray(value)) {
      value.map((val) => formdata.append(`${key}[]`, val));
    } else {
      formdata.append(key, JSON.stringify(value));
    }
  }

  return formdata;
}
