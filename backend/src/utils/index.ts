import { APIResponse, ErrorResponse } from "../types";

export const formatSuccessResponse = <T>(message: string, data?: T): APIResponse<T> => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

export const formatErrorResponse = (
  message: string,
  error: string,
  statusCode: number = 500,
  stack?: string
): ErrorResponse => {
  return {
    success: false,
    message,
    error,
    statusCode,
    timestamp: new Date().toISOString(),
    stack,
  };
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
