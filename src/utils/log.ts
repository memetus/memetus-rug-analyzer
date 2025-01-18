import { logger } from "@/main";

export const logInfo = (log: string) => {
  logger.info(log);
};

export const logError = (log: string) => {
  logger.error(log);
};

export const logWarn = (log: string) => {
  logger.warn(log);
};

export const logDebug = (log: string) => {
  logger.debug(log);
};

export const logVerbose = (log: string) => {
  logger.verbose(log);
};
