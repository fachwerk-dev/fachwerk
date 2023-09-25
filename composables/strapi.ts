import { has, isArray, head, forEach, isObject } from "lodash-es";

export const parseStrapi = (data: any): any => {
  if (has(data, "attributes")) {
    return parseStrapi(removeObjectKey(data, "attributes"));
  }

  if (isArray(data) && data.length && has(head(data), "attributes")) {
    return data.map((e: any) => parseStrapi(e));
  }

  forEach(data, (value: any, key: string) => {
    if (!value) {
      return;
    }

    if (isObject(value)) {
      data[key] = parseStrapi(value);
    }

    if (isArray(value)) {
      data[key] = value.map((field) => parseStrapi(field));
    }

    if (has(value, "data")) {
      let relation = null;
      if (isObject(value.data)) {
        relation = parseStrapi(value.data);
      }

      if (isArray(value.data)) {
        relation = value.data.map((e: any) => parseStrapi(e));
      }

      data[key] = relation;
    }

    if (has(value, "id")) {
      data[key] = parseStrapi(value);
    }

    if (isArray(value) && has(head(value), "id")) {
      data[key] = value.map((p) => parseStrapi(p));
    }

    if (has(value, "provider")) {
      return;
    }

    if (isArray(value) && has(head(value), "provider")) {
      return;
    }
  });

  return data.data ? data.data : data;
};

const removeObjectKey = (object: any, key: string) => ({
  id: object.id,
  ...object[key],
});
