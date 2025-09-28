import e, { NextFunction,Request,Response, RequestHandler } from "express";

const trycatch = (hardler: RequestHandler): RequestHandler => {
    return async (req: Request, res : Response, next: NextFunction) => {
        try {
        await hardler(req, res, next);
        } catch (error:any) {
            res.status(500).json({
                message: error.message,
        }
        )}
        }
    }

export default trycatch;