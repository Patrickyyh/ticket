import mongoose from "mongoose";
import { OrderStatus } from "@ticketyyh/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface OrderAttrs{
    userId: string;
    id: string;
    status: OrderStatus;
    price: number;
    version: number;
}

interface OrderDoc extends mongoose.Document{
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}


interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttrs): OrderDoc; 
}




const orderSchema = new mongoose.Schema({
    userId : {
        type: String,
        required: true,
    },
    status : {
        type: String,
        required: true,
    },
    price:{
        type:Number,
        requireed: true,
    },
    
}, {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  });

orderSchema.set('versionKey','version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs:OrderAttrs) => {
    return new Order ({
        _id: attrs.id,
        version: attrs.version,
        status: attrs.status,
        userId: attrs.userId,
        price: attrs.price,
    });
};

const Order = mongoose.model<OrderDoc,OrderModel>('Order',orderSchema);
export {Order};
