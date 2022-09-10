import express, {Request, Response} from 'express'
import { body } from 'express-validator';
import { BadRequestError ,validateRequest} from '@ticketyyh/common';
import { User } from '../models/User';
import { Password } from '../services/password';

// json web token
import jwt from 'jsonwebtoken';

console.log('delete later');

const router = express.Router();
router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email must be valid'),
    body("password")
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
]
,
 validateRequest
,async (req:Request,res:Response)=>{

    const {email , password} = req.body;
    const existingUser = await User.findOne({email});
    if(!existingUser){
        throw new BadRequestError('You provide Invalid Credentials');
    }

    const passwordMatch = await Password.compare(existingUser.password,password);
    if(!passwordMatch){
        throw new BadRequestError('You provide Invalid Credentials');
    }


    // create a Jwt and embed the jwt inside the cookie
    const userJwt = jwt.sign({
        id :  existingUser.id,
        email: existingUser.email
    },process.env.JWT_KEY!);
    req.session = {
        jwt: userJwt
    }

    res.status(201).send(existingUser);



})

export {router as signinRouter}
