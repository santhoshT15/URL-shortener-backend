const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userShema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role :{
        type:String,
        default: 'user'
    },
    resetPasswordToken:String,
    resetPasswordTokenExpire: Date,
    createdAt :{
        type: Date,
        default: Date.now
    }
});

userShema.methods.generateJwtToken=(id)=>{
    return jwt.sign(
        {id},
        urlshortener,
        {expiresIn:2 }
        )
}

userShema.methods.getResetToken= function(){
    //generate reset token
    const token = crypto.randomBytes(20).toString('hex')

    //generate hash set to resetPassword token
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    //set token expire time
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;
    
    return token;
}
const user = mongoose.model('User', userShema);
module.exports = user
