import consola from 'consola';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

type HttpErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'NOT_ACCEPTABLE'
  | 'REQUEST_TIMEOUT'
  | 'CONFLICT'
  | 'GONE'
  | 'LENGTH_REQUIRED'
  | 'PRECONDITION_FAILED'
  | 'PAYLOAD_TOO_LARGE'
  | 'URI_TOO_LONG'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'RANGE_NOT_SATISFIABLE'
  | 'EXPECTATION_FAILED'
  | 'TEAPOT';

type BackendErrorCode = 'VALIDATION_ERROR' | 'USER_NOT_FOUND' | 'INVALID_PASSWORD';

type ErrorCode = HttpErrorCode | BackendErrorCode | 'INTERNAL_ERROR';
type ErrorCodeNumber = number;


export enum EnumErrorCode {
  BAD_REQUEST = 40000,
  UNAUTHORIZED = 40001,
  INVALID_PASSWORD = 40001,
  NOT_FOUND = 40004,
  USER_NOT_FOUND = 40004,
  METHOD_NOT_ALLOWED = 40005,
  NOT_ACCEPTABLE = 40006,
  REQUEST_TIMEOUT = 40008,
  CONFLICT = 40009,
  GONE = 40010,
  cLENGTH_REQUIRED = 40011,
  PRECONDITION_FAILED = 40012,
  PAYLOAD_TOO_LARGE = 40013,
  URI_TOO_LONG = 40014,
  UNSUPPORTED_MEDIA_TYPE = 40015,
  RANGE_NOT_SATISFIABLE = 40016,
  EXPECTATION_FAILED = 40017,
  TEAPOT = 40018,
  INTERNAL_ERROR = 99999,
  PROXY_ERROR = 30000,

  PARAM_ERROR = 40001,
}


export function getStatusFromErrorCode(code: ErrorCode): number {
  switch (code) {
    case 'BAD_REQUEST':
    case 'VALIDATION_ERROR':
      return 40000;
    case 'UNAUTHORIZED':
    case 'INVALID_PASSWORD':
      return 40001;
    case 'NOT_FOUND':
    case 'USER_NOT_FOUND':
      return 40004;
    case 'METHOD_NOT_ALLOWED':
      return 40005;
    case 'NOT_ACCEPTABLE':
      return 40006;
    case 'REQUEST_TIMEOUT':
      return 40008;
    case 'CONFLICT':
      return 40009;
    case 'GONE':
      return 40010;
    case 'LENGTH_REQUIRED':
      return 40011;
    case 'PRECONDITION_FAILED':
      return 40012;
    case 'PAYLOAD_TOO_LARGE':
      return 40013;
    case 'URI_TOO_LONG':
      return 40014;
    case 'UNSUPPORTED_MEDIA_TYPE':
      return 40015;
    case 'RANGE_NOT_SATISFIABLE':
      return 40016;
    case 'EXPECTATION_FAILED':
      return 40017;
    case 'TEAPOT':
      return 40018; // I'm a teapot
    case 'INTERNAL_ERROR':
      return 50000;
    default:
      return 50000;
  }
}

export function getMessageFromErrorCode(code: ErrorCodeNumber): string {
  switch (code) {
    case 50000:
      return 'The request is invalid.';
    case 60000:
      return 'The request contains invalid or missing fields.';
    case 40001:
      return '登录失败';
    case 40004:
      return 'The requested resource was not found.';
    case 40009:
      return 'The user was not found.';
    case 99999:
      return 'An internal server error occurred.';
    case 80000:
      return 'The request conflicts with the current state of the server.';
    case 40010:
      return 'The password is incorrect.';
    default:
      return 'An internal server error occurred.';
  }
}

export function handleValidationError(err: ZodError): {
  invalidFields: string[];
  requiredFields: string[];
} {
  const invalidFields = [];
  const requiredFields = [];

  for (const error of err.errors) {
    if (error.code === 'invalid_type')
      invalidFields.push(error.path.join('.'));
    else if (error.message === 'Required')
      requiredFields.push(error.path.join('.'));
  }

  return {
    invalidFields,
    requiredFields,
  };
}

export class BackendError extends Error {
  code: number;
  details?: unknown;
  constructor(
    code: number,
    {
      message,
      details,
    }: {
      message?: string;
      details?: unknown;
    } = {},
  ) {
    super(message ?? '内部服务错误');
    this.code = code;
    this.details = details;
  }
}

export function errorHandler(error: any, req: Request, res: Response<{
  code: number;
  message: string;
  details?: unknown;
}>, _next: NextFunction) {


  consola.log("errorHandler:", error)

  let statusCode = 200;
  let code: number | undefined;
  let message: string | undefined;
  let details: unknown | undefined;

  const ip = req.ip;
  const url = req.originalUrl;
  const method = req.method;

  if (error instanceof BackendError) {
    message = error.message;
    code = error.code;
    details = error.details;
    statusCode = 200; // getStatusFromErrorCode(code);
  }

  if (error instanceof ZodError) {
    code = 5000;
    message = getMessageFromErrorCode(code);
    details = handleValidationError(error);
    statusCode = 200;
  }

  if ((error as { code: string }).code === 'ECONNREFUSED') {
    code = 9000;
    message = 'The DB crashed maybe because they dont like you :p';
    details = error;
  }


  message = code ? getMessageFromErrorCode(code) : error?.message || "未知错误";
  details = details ?? error;

  consola.error(`${ip} [${method}] ${url} ${code} - ${message}`);

  res.status(statusCode).json({
    code: code || 9999,
    message: message!,
    details,
  });
}

export function handle404Error(_req: Request, res: Response) {
  const code: ErrorCode = 'NOT_FOUND';
  res.status(getStatusFromErrorCode(code)).json({
    code,
    message: 'Route not found',
    details: 'The route you are trying to access does not exist',
  });
}
