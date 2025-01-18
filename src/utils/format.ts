export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
};

export const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export const flattenArray = <T>(arr: any[]): T[] => {
  return arr.reduce<T[]>(
    (acc, val) => acc.concat(Array.isArray(val) ? flattenArray(val) : val),
    []
  );
};

export const toCamelCase = (str: string): string => {
  return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
};

export const toSnakeCase = (str: string): string => {
  return str
    .replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)
    .replace(/^_/, "");
};

export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce((result, currentItem) => {
    const groupKey = String(currentItem[key]);
    result[groupKey] = result[groupKey] || [];
    result[groupKey].push(currentItem);
    return result;
  }, {} as Record<string, T[]>);
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
};

export const getNestedValue = <T>(
  obj: Record<string, any>,
  path: string,
  defaultValue?: T
): T | undefined => {
  const result = path.split(".").reduce<any>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return acc[key];
    }
    return undefined;
  }, obj);

  return result !== undefined ? result : defaultValue;
};

export function findDuplicates<T>(array: T[]): T[] {
  const seen = new Set<T>();
  const duplicates = new Set<T>();

  for (const item of array) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return Array.from(duplicates);
}