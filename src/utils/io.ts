import { readFile } from "fs";
import { writeFile } from "fs";
import { promises as fs } from "fs";

export const executeRead = async (path: string) => {
  readFile(path, "utf-8", (err, data) => {
    if (err) {
      throw new Error(err.message);
    }

    return data;
  });
};

export const executeReadAsync = async (path: string) => {
  try {
    const value = await fs.readFile(path, "utf-8");

    return value;
  } catch (err) {
    throw new Error(err as string);
  }
};

export const executeWrite = async (path: string, data: string) => {
  writeFile(path, data, (err) => {
    if (err) {
      throw new Error(err.message);
    }
  });
};

export const executeWriteAsync = async (path: string, data: string) => {
  try {
    const value = await fs.writeFile(path, data, "utf-8");

    return value;
  } catch (err) {
    throw new Error(err as string);
  }
};
