export const safePromise = <T>(
  promise: Promise<T>
): Promise<[T | null, any | null]> => {
  return promise
    .then<[T | null, any | null]>((result) => [result, null])
    .catch<[T | null, any | null]>((error) => [null, error]);
};
