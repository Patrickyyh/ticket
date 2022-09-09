import express from 'express'
const router = express.Router();
import jwt from 'jsonwebtoken';

import {currentUser} from '@ticketyyh/common';
// import  { requireAuth }  from '../middlewares/require-auth'

// put the current user middle over here
router.get('/api/users/currentuser', currentUser,(req,res)=>{
    res.send({currentUser: req.currentUser || null});
    // if(!req.session || !req.session.jwt){
    //     return res.send({currentUser: null});
    // }
    // try {
    //     const payload = jwt.verify(req.session.jwt,process.env.JWT_KEY!);
    //     // payload = {id:user.id , email: user.emai}
    //     res.send({currentUser: payload});
    // } catch (error) {
    //     res.send({currentUser: null});
    // }
    
})

export {router as currentUserRouter}

