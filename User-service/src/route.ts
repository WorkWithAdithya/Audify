// import express from 'express';
// import { register } from 'module';
// import { registerUser } from './controller.js';

// const router = express.Router();

// router.post("/user/register",registerUser);


// export default router;

import express from 'express';
import { loginUser, registerUser , myProfile } from './controller.js'; // import your controller correctly
import { isAuth } from './middleware.js';


const router = express.Router();

// POST /api/v1/user/register
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/me",isAuth,myProfile);
export default router;
