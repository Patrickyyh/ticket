import express , {Request, Response} from 'express';
import { body } from 'express-validator';
import {
        BadRequestError,
        NotAuthError,
        NotFoundError,
        OrderStatus,
        requireAuth,
        validateRequest

 } from '@ticketyyh/common';
 import { Order } from '../models/Order';
 import { Payment } from '../models/Payment';
 import { stripe } from '../stripe';

 import { PaymentCreatedPublisher } from
  '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

console.log("here")
 const router = express.Router();
 router.post('/api/payment' ,requireAuth ,
   [
      body('token').not().isEmpty(),
      body('orderId').not().isEmpty()
   ],
    validateRequest,
    async (req:Request , res:Response) => {
        const {token, orderId} = req.body;
        const order = await Order.findById(orderId);

        if(!order){
            throw new NotFoundError()
        }

        if(order.userId !== req.currentUser!.id){
            throw new NotAuthError();
        }

        if(order.status === OrderStatus.Cancelled){
            throw new BadRequestError("Cannot pay for an cancelled order");
        }

        const chargeResponse = await stripe.charges.create({
            amount: order.price * 100,
            currency:'usd',
            source: token
        });

        const payment  =  Payment.build({
            orderId,
            stripeId : chargeResponse.id,
        });

        await payment.save();
        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });
        res.status(201).send({id: payment.id});

   })


 export {router as createChargeRouter }
