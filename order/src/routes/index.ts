import express , {Request, Response} from 'express';
import { body } from 'express-validator';
import { Order } from '../models/Order';
import { 
         requireAuth ,
         validateRequest,
         BadRequestError,
         NotFoundError,
        } from '@ticketyyh/common';

// Retrive all active orders for the given user making the request 

const router = express.Router();
router.get('/api/orders',requireAuth, async (req:Request, res:Response)=>{
    
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');
    
    res.send(orders);


});

export {router as indexOrderRouter};
