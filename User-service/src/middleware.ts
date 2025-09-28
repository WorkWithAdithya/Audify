import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import type { IUser } from './model.js'; // only type
import { User } from './model.js';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.token as string; // or Authorization header

        if (!token) {
         res.status(403).json({ message: 'Please login!' });
        }

        const decodedValue = jwt.verify(token, process.env.JWT_SEC as string) as JwtPayload;

        if (!decodedValue || !decodedValue._id) {
             res.status(403).json({ message: 'Invalid token' });
        }

        const userId = decodedValue._id;

        const user = await User.findById(userId).select('-password');

        if (!user) {
         res.status(403).json({ message: 'User not found' });

         return;
        }

        req.user = user;
        next();
    }   
    
        catch (error) {
        return res.status(403).json({ message: 'Please login!' });
    }
};
