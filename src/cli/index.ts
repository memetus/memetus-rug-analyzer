export const RESET = "\x1b[0m";
export const RED = "\x1b[31m";
export const GREEN = "\x1b[32m";
export const YELLOW = "\x1b[33m";
export const BLUE = "\x1b[34m";

export function startLoadingAnimation(
  startLog: string,
  endLog?: string
): () => void {
  const spinner = ["|", "/", "-", "\\"];
  let i = 0;

  console.log(startLog);

  const interval = setInterval(() => {
    process.stdout.write(`\r${spinner[i++]}`);
    i %= spinner.length;
  }, 100);

  return () => {
    clearInterval(interval);
    endLog && console.log(endLog);
  };
}
