"use strict";
const utilsHelper = {};

// Manage how we respond to clients here when needed
utilsHelper.sendResponse = (res, status, success, data, errors, message) => {
  const response = {};
  if (success) response.success = success;
  if (data) response.data = data;
  if (errors) response.errors = errors;
  if (message) response.message = message;
  return res.status(status).json(response);
};

// Catch every error here
utilsHelper.catchAsync = (func) => (req, res, next) =>
  func(req, res, next).catch((err) => next(err));

// Use an array here to filter for admissableFields on each resource
utilsHelper.filterFields = (obj, allows) => {
  const result = {};
  for (const field of allows) {
    result[field] = field in obj ? obj[field] : "";
  }
  return result;
};

class AppError extends Error {
  constructor(statusCode, message, errorType) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    // all errors using this class are operational errors.
    this.isOperational = true;
    // create a stack trace for debugging (Error obj, void obj to avoid stack pollution)
    Error.captureStackTrace(this, this.constructor);
  }
}

utilsHelper.unique = (a) => {
  if (!a || !Array.isArray(a)) return [];
  return a
    .sort()
    .filter((item, index, arr) => !index || item != arr[index - 1]);
};

utilsHelper.AppError = AppError;
module.exports = utilsHelper;
