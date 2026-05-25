import { safeJSONParse, safeLocalStorage } from '../utils/helpers';

const STORAGE_KEY_ERROR_LOGS = 'boki_error_logs_v1';
const MAX_ERROR_LOGS = 30;

export interface ErrorLogRecord {
  id: string;
  date: string;
  source: string;
  message: string;
  stack?: string;
  context?: string;
}

let globalHandlersInstalled = false;

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
};

const getErrorStack = (error: unknown): string | undefined => (
  error instanceof Error ? error.stack : undefined
);

export const getErrorLogs = (): ErrorLogRecord[] => {
  const str = safeLocalStorage.getItem(STORAGE_KEY_ERROR_LOGS);
  return str ? safeJSONParse<ErrorLogRecord[]>(str, []) : [];
};

export const recordError = (source: string, error: unknown, context?: string): void => {
  const record: ErrorLogRecord = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    source,
    message: getErrorMessage(error),
    stack: getErrorStack(error),
    context
  };

  const nextLogs = [record, ...getErrorLogs()].slice(0, MAX_ERROR_LOGS);
  safeLocalStorage.setItem(STORAGE_KEY_ERROR_LOGS, JSON.stringify(nextLogs));
};

export const clearErrorLogs = (): void => {
  safeLocalStorage.removeItem(STORAGE_KEY_ERROR_LOGS);
};

export const installGlobalErrorHandlers = (): void => {
  if (typeof window === 'undefined' || globalHandlersInstalled) return;
  globalHandlersInstalled = true;

  window.addEventListener('error', (event) => {
    recordError('window.error', event.error ?? event.message, `${event.filename}:${event.lineno}:${event.colno}`);
  });

  window.addEventListener('unhandledrejection', (event) => {
    recordError('window.unhandledrejection', event.reason);
  });
};