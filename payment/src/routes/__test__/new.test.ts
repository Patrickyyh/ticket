import { OrderStatus } from '@ticketyyh/common';
import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import {stripe} from '../../stripe';
// jest.mock('../../stripe');
import { Order } from '../../models/Order';
import { Payment } from '../../models/Payment'



it('retursn a 404 when purchasing and order that does not exist' , async () =>{
    await request(app)
        .post('/api/payment')
        .set('Cookie', global.signin())
        .send({orderId: new mongoose.Types.ObjectId(),
               token: 'something'})
        .expect(404);
});



it('retursn a 401 when purchasing and order that does not belong to the user' , async () =>{
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId : new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
    .post('/api/payment')
    .set('Cookie', global.signin())
    .send({orderId: order.id,
           token: 'something'})
    .expect(401);

});


it('retursn a 400 when purchasing and cancelle order' , async () =>{

    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId : userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    });
    await order.save();

    await request(app)
    .post('/api/payment')
    .set('Cookie', global.signin(userId))
    .send({orderId: order.id,
           token: 'something'})
    .expect(400);
});

it('returns a 201 with valid inputs' , async () => {

    console.log("here");
    console.log("second")

    console.log("over here")

    // const userId = new mongoose.Types.ObjectId().toHexString();
    // const price = Math.floor(Math.random() * 100000);
    // const order = Order.build({
    //     id: new mongoose.Types.ObjectId().toHexString(),
    //     userId : userId,
    //     version: 0,
    //     price: price,
    //     status: OrderStatus.Created
    // });
    // await order.save();

    // await request(app)
    // .post('/api/payment')
    // .set('Cookie', global.signin(userId))
    // .send({
    //        orderId: order.id,
    //        token: 'tok_visa'})
    // .expect(201);

    // const stripeCharges = await stripe.charges.list({limit: 50});
    // const stripeCharge = stripeCharges.data.find(charge => {
    //     return charge.amount === price * 100
    // })
    // expect(stripeCharge).toBeDefined();
    // expect(stripeCharge!.currency).toEqual('usd');

    // const payment = await Payment.findOne({
    //     orderId: order.id,
    //     stripeId: stripeCharge!.id
    // })
    // expect(payment).not.toBeNull();

    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    // console.log((stripe.charges.create as jest.Mock).mock.calls)
    // expect(chargeOptions.source).toEqual('tok_visa');
    // expect(chargeOptions.amount).toEqual(20*100);
    // expect(chargeOptions.currency).toEqual('usd');


})



