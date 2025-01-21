export const parseTwitterHandle = (url: string) => {
  const lastSlashIndex = url.lastIndexOf("/");
  const handle = url.slice(lastSlashIndex + 1);
  return handle;
};
