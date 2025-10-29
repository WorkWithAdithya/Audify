import { NextFunction, Request, RequestHandler, Response } from "express";

const TryCatch = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      // Keep your original logic: always 500 with message
      res.status(500).json({
        message: error?.message || "Internal Server Error",
      });
    }
  };
};

export default TryCatch;