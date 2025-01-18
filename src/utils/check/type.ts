/**
 * @description utility functions for type checking or type guarding
 */

export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === "number";
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

export const isObject = (value: unknown): value is object => {
  return typeof value === "object";
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

export const isJsonString = (value: string): value is string => {
  try {
    const data = JSON.parse(value);
    return typeof data === "object";
  } catch (error) {
    return false;
  }
};
