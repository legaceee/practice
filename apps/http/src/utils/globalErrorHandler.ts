// import { Request, Response } from "express";
// import { AppError } from "./errorHandler";

// const handlePrismaErrors = (err: any) => {
//   if (err.code === "P2002") {
//     const fields = err.meta?.target?.join(",") || "fields";
//     return new AppError(`Duplicate value for ${fields}`, 400);
//   }

//   if (err.code === "P2003") {
//     return new AppError("Invalid refernce (related record not found)", 400);
//   }
//   if (err.code === "P2025") {
//     return new AppError("Record not found", 404);
//   }

//   return err;
// };

// const handleJWTErrors = (err: any) => {
//   if (err.name === "JSONWebTokenError") {
//     return new AppError("Invalid ttoken,please login again", 401);
//   }
//   if (err.name === "TokenExpiredError") {
//     return new AppError("Your token has expired, please log in again", 401);
//   }
//   return err;
// };
// export default (err: any, req: Request, res: Response, next: any) => {
//   // Default values
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";

//   let error = { ...err };
//   error.message = err.message;

//   // Prisma
//   if (err.code && err.code.startsWith("P2")) error = handlePrismaErrors(err);

//   // JWT
//   if (
//     err.name &&
//     (err.name === "JSONWebTokenError" || err.name === "TokenExpiredError")
//   ) {
//     error = handleJWTErrors(err);
//   }
//   res.status(error.statusCode || 500).json({
//     status: error.status || "error",
//     message: error.message || "Something went wrong",
//     ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
//   });
// };
import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

const handlePrismaErrors = (err: any) => {
  if (err.code === "P2002") {
    const fields = err.meta?.target?.join(",") || "fields";
    return new AppError(`Duplicate value for ${fields}`, 400);
  }

  if (err.code === "P2003") {
    return new AppError("Invalid reference (related record not found)", 400);
  }

  if (err.code === "P2025") {
    return new AppError("Record not found", 404);
  }

  return err;
};

const handleJWTErrors = (err: any) => {
  if (err.name === "JSONWebTokenError") {
    return new AppError("Invalid token, please login again", 401);
  }

  if (err.name === "TokenExpiredError") {
    return new AppError("Token expired, please login again", 401);
  }

  return err;
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  // Transform known errors
  if (error.code && error.code.startsWith("P2")) {
    error = handlePrismaErrors(error);
  }

  if (
    error.name === "JSONWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    error = handleJWTErrors(error);
  }

  // Default values
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";

  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
