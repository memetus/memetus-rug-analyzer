const args = process.argv.slice(2);

export const getArg = () => {
  const parsedArgs: { [key: string]: string | boolean } = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      const value =
        args[i + 1]?.startsWith("--") || args[i + 1] === undefined
          ? true
          : args[++i];
      parsedArgs[key] = value;
    } else if (args[i].startsWith("-")) {
      const key = args[i].slice(2);
      const value =
        args[i + 1]?.startsWith("-") || args[i + 1] === undefined
          ? true
          : args[++i];
      parsedArgs[key] = value;
    }
  }

  return parsedArgs;
};
