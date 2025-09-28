import { Request, Response } from 'express';
import trycatch from './trycatch.js';
import { User } from './model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from './middleware.js';

export const registerUser = trycatch(async (req: Request, res: Response) => {
    const { name, email , password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
        res.status(400).json({ message: 'User already exists' });

        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({ name, email, password: hashedPassword});


    const token = jwt.sign({ _id:user._id},process.env.JWT_SEC as string,{expiresIn:"7d",

    });
    res.status(201).json({ message :"User registered",
        user,
        token,
    })

});

export const loginUser = trycatch(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
        res.status(404).json({ 
            message: 'User not exist', });
        return ;
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
         res.status(400).json({ message: 'Invalid password' });
        return;
    }

    const token = jwt.sign({ _id:user._id},process.env.JWT_SEC as string,{expiresIn:"7d",

    });
    res.status(200).json({ message :"User logged in",
        user,
        token,
    })
});


export const myProfile = trycatch(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user

    res.json(user);
});