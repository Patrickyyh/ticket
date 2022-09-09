import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
// import dotenv from 'dotenv';

// Router
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

import { errorHandler,NotFoundError } from '@ticketyyh/common';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false, // no need to encrypt the cookie 
    secure: process.env.NODE_ENV !== 'test' , // must be http connection 
}))

// Router 
app.use(currentUserRouter);
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

// take charge of handling router not found errors 
app.get('*',async ()=>{
    throw new NotFoundError(); 
})
app.use(errorHandler); 
export { app } ; 
