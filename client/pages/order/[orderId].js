import { useEffect ,useState} from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from 'next/router'

const OrderShow = ({order, currentUser}) => {
    const [timeRemain, setTimeRemain] = useState(0);
    const {doRequest , errors} = useRequest({
        url: '/api/payment',
        method :'post',
        body:{
            orderId: order.id,
        },
        onSuccess : ()=> Router.push('/order'),
    });

     useEffect(()=>{
        const findTimeLeft = ()=>{
            const timeLeft = new Date(order.expiresAt) - new Date();
            setTimeRemain(Math.round(timeLeft/1000));
        };

        findTimeLeft();
        const timeId = setInterval(findTimeLeft , 1000);

        // Clean up function
        // this function will be called when rerendered or nagivated out to another page
        return ()=>{
            clearInterval(timeId);
        }
     },[]);

    if(timeRemain < 0){
        return <div>Order Expired</div>
    }

    return <div>Time left to Pay: {timeRemain}
    {/* we need to extract the id(token) and make another request to the payment service */}
        <StripeCheckout
            token = {({id}) => doRequest({token: id})}
            stripeKey ="pk_test_51IBviEEYMntgAU218yZTxJjh1BxTNjMWcGWinEgPEhDcHXRmZvgVVz7jx8BlD2XEOoa3r6ljXwOdh0zdeE1ZxVZE004hfrRM01"
            amount={order.ticket.price * 100}
            email = {currentUser.email}
        />
    </div>

}

OrderShow.getInitialProps = async(context, client) => {
    const { orderId } = context.query;
    const  { data } = await client.get(`/api/orders/${orderId}`);
    return {order: data}
}




export default OrderShow;
