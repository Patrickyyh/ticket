import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';


// Router
import { errorHandler,NotFoundError ,NotAuthError , currentUser} from '@ticketyyh/common';
import { deleteOrderRouter } from './routes/delete';
import { newOrderRouter } from './routes/new';
import { indexOrderRouter } from './routes';
import { showOrderRouter } from './routes/show';

// middleware
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false, // no need to encrypt the cookie 
    secure: process.env.NODE_ENV !== 'test' , // must be http connection 
}))

// Router 
app.use(currentUser);

app.use(deleteOrderRouter);
app.use(newOrderRouter); 
app.use(indexOrderRouter);
app.use(showOrderRouter);

// take charge of handling router not found errors 
app.get('*',async ()=>{
    throw new NotFoundError(); 
})
app.use(errorHandler); 
export { app } ; 
