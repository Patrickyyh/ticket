import axios from "axios";
import { useState } from "react"
import useRequest from "../../hooks/use-request";
import Router from 'next/router'


export default ()=>{
    const [email, setEmail]      = useState('');
    const [password,setPassword] = useState('');
    const {doRequest ,errors} = useRequest({
      url: '/api/users/signin',
      method: 'post',
      body: {
        email,
        password
      }
      ,
      onSuccess: () => Router.push('/')
    }
     
    );

    const onSubmit = async (event)=>{
        event.preventDefault();
        await doRequest();

        // redirect if there is no error over here

    }


        
    return (

       <section className="vh-100" style={{backgroundColor: "eee"}}>
         <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Ticketing</p>
         <div className="container h-100">
           <div className="row d-flex justify-content-center align-items-center h-100">
             <div className="col-lg-12 col-xl-11">
               <div className="card text-black" style={{borderRadius: "25px" }}>
                 <div className="card-body p-md-5">
                   <div className="row justify-content-center">
                     <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
       
                       <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign in</p>
       
                       <form  onSubmit={onSubmit} >
       
                         <div className="d-flex flex-row align-items-center mb-4">
                           <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                           <div className="form-outline flex-fill mb-0">
                              <input
                              value={email} 
                              onChange = {e => setEmail(e.target.value)}  
                              className="form-control" />
                              <label className="form-label" >Your Email</label>
                           </div>
                         </div>
       

                         <div className="d-flex flex-row align-items-center mb-4">
                           <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                           <div className="form-outline flex-fill mb-0">
                             <input type="password" 
                                    value = {password} 
                                    onChange = {e => setPassword(e.target.value)} 
                                    className="form-control" />
                             <label className="form-label" >Password</label>
                           </div>
                         </div>

                          { errors }
                         <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                           <button  className="btn btn-primary btn-lg" >Register</button>
                         </div>
       
                       </form>
       
                     </div>
                     <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
       
                       <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                         className="img-fluid" alt="Sample image" />
       
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>
    )
}