import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';


// Router
import { errorHandler,NotFoundError ,NotAuthError , currentUser} from '@ticketyyh/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

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
app.use(createTicketRouter);
app.use(showTicketRouter); 
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// take charge of handling router not found errors 
app.get('*',async ()=>{
    throw new NotFoundError(); 
})
app.use(errorHandler); 
export { app } ; 
