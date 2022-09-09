import mongoose from "mongoose";
import { Password } from '../services/password';

// An interface that describes the properties 
// that a User Model has
// that are required to create a new User. 
interface UserAttrs {
    email:  string;
    password: string;
}

interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc; 
}


// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document{
    email: string;
    password: string; 
}


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
        unique: true,
      },

      password: {
        type: String,
        required:true,
        unique: true,
      }, 

} ,{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password
            delete ret.__v;
            
        }
    }
});

UserSchema.statics.build = (attrs: UserAttrs)=>{
    return new User(attrs);
}

UserSchema.pre('save',async function(done) {
 
    // if other information changed, skip this part
    if(this.isModified('password')){
        const hashedPassword = await Password.toHash(this.get('password'));
        this.set('password',hashedPassword);
    }   
    done();
})


const User = mongoose.model<UserDoc, UserModel>('User',UserSchema);


User.build({
    email:'yeyuhao1234',
    password:' second'
})
// for properties check for typescript
export {User};
