import express , {Request, Response} from 'express';
import { body } from 'express-validator';
import { Order } from '../models/Order';
import { NotAuthError, NotFoundError, requireAuth } from '@ticketyyh/common';

//Get details about a specific order

const router = express.Router();
router.get('/api/orders/:orderId',requireAuth,async (req:Request, res:Response)=>{
    const order = await Order.findById(req.params.orderId).populate('ticket');    

    if(!order){
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthError();
    }
    res.send(order);
});

export {router as showOrderRouter};