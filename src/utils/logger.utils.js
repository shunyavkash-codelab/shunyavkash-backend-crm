import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[38;2;128;255;128m',
  yellow: '\x1b[38;2;255;227;57m',
  blue: '\x1b[38;2;128;255;255m',
  red: '\x1b[1;38;2;255;128;128m'
};

let enableFileLogging = true;

const formatArgs = args =>
  args.map(arg =>
    typeof arg === 'object' ? `\n${JSON.stringify(arg, null, 2)}` : arg
  );

// Function to get the filename of the caller
const getCallerFile = () => {
  const stack = new Error().stack.split('\n');
  const callerLine = stack[3] || ''; // Adjust index based on V8 stack trace format
  const match = callerLine.match(/\((.*):(\d+):(\d+)\)$/);

  if (match) {
    return path.basename(match[1]); // Extract just the filename
  }
  return 'unknown';
};

const writeToLogFile = (level, message, filename) => {
  if (!enableFileLogging) return;

  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] [${filename}] ${message}\n`;
};

const logger = {
  log: (...args) => {
    const filename = getCallerFile();
    const message = formatArgs(args).join(' ');
    console.log(`${colors.green}[LOG] [${filename}]`, ...formatArgs(args));
    writeToLogFile('LOG', message, filename);
  },
  info: (...args) => {
    const filename = getCallerFile();
    const message = formatArgs(args).join(' ');
    console.info(`${colors.blue}[INFO] [${filename}]`, ...formatArgs(args));
    writeToLogFile('INFO', message, filename);
  },
  warn: (...args) => {
    const filename = getCallerFile();
    const message = formatArgs(args).join(' ');
    console.warn(`${colors.yellow}[WARN] [${filename}]`, ...formatArgs(args));
    writeToLogFile('WARN', message, filename);
  },
  error: (...args) => {
    const filename = getCallerFile();
    let formattedArgs = args.map(arg => {
      if (arg instanceof Error) {
        return `[${arg.name}] ${arg.message}\nStack: ${arg.stack}`;
      }
      return formatArgs([arg]).join(' ');
    });
    const message = formattedArgs.join(' ');
    console.error(`${colors.red}[ERROR] [${filename}]`, message);
    writeToLogFile('ERROR', message, filename);
  },

  setConfig: ({ enableFileLogging: loggingEnabled }) => {
    if (typeof loggingEnabled === 'boolean') {
      enableFileLogging = loggingEnabled;
    }
  }
};

export default logger;
