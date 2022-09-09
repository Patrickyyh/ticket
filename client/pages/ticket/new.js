import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
const NewTicket  = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const {doRequest, errors} = useRequest({
        url:'/api/tickets',
        method: 'post',
        body:{
            title,
            price
        },
        onSuccess: ()=>Router.push('/')
    })


    const onBlur = ()=>{
        const value = parseFloat(price);
        if(isNaN(value)){
            return; 
        }
        // round up the price
        setPrice(value.toFixed(2));    
    }

    const onSubmit = async (event)=>{
        event.preventDefault();
        const ticket = await doRequest();
    }



   return(
         <div>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input  value = {title} onChange = {(e) =>setTitle(e.target.value) } className="form-control"/>
                </div>
                <div className="form-group">
                    <label className="form-label">Price</label>
                    <input value={price} onBlur = {onBlur} onChange = {(e) => setPrice(e.target.value) } className="form-control"/>
                </div>
                {errors}
                <button className="btn btn-primary">Submit</button>
            </form>
         </div>
   )
}

export default NewTicket;
