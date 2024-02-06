const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const sendMail = require("../nodemail/nodeMail");
const crypto = require("crypto");

//signup the user
const signUp= async(req,res)=>{
    try {
        let user = await User.findOne({email:req.body.email});
        if(user){
            //check user 
            res.status(400).json({message:'Given email already exit'});
        }else{
            //new user 
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt)

            user = await new User({
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email,
                password:hashedPassword
            }).save();

            const token = user.generateJwtToken(user._id)
            res.status(200).json({ 
                user,
                message:'Signup successful',
                token
            })    
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({data:"Internal Server error"})
    }
};

//login the user

const logIn = async(req,res)=>{
try {
    //is user email valid
    const user = await User.findOne({email:req.body.email});
    if(!user){
       return res.status(400).json({message:'Invalid User email or password '})
    }
    //is user password valid
    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    )
    if(!validPassword){
       return res.status(400).json({message:'Invalid User email or password'})
    }
    const token = user.generateJwtToken(user._id);
        return res.status(200).json({
        user,
        message:'Login successful',
        token
    })    

} catch (error) {
    console.log(error)
    res.status(500).json({data:"Internal Server error"})
}
};

//Route for the forgot passsword page

const forgotPassword = async(req,res)=>{
const {email} = req.body;
try {
    //is email is valid
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({error:"user not found"});
    }
    //set the reset password token
    const resetToken = user.getResetToken();
    //save the token in dadtabase
    await user.save()

    //create reset url
    const resetUrl = `https://url-shortener-official.netlify.app/reset/password/${resetToken}`

    const message = `Your password reset url is as follows \n\n 
    ${resetUrl} \n\n If you have not requested this email, then ignore it.`;
     // Save the reset token in the database
  await user.save();
  sendMail({ 
    email: user.email,
    subject: "Password Recovery",
    message
  })
  res.status(200).json({
    success: true,
    message: `Email sent to ${user.email}`
})

} catch (error) {
    console.log(error)
    res.status(500).json({data:"Internal Server error"})
}
};

//route for reset the new user password

const resetPassword = async(req,res)=>{

const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
try {
    //find the user with token
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire:{ $gt: Date.now()}
    })
    if(!user){
        return res.status(400).json({error:'invalid or expired token'})
    }
    if(req.body.password !== req.body.confirmPassword){
        return res.status(400).json({error:'password does not match'})
    }

    //hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    //save the new hash password in database
    user.save();
    const token = user.generateJwtToken(user._id)
    res.status(200).json({
        user,
        message:'reset password successful',
        token
    }) 
} catch (error) {
    console.log(error)
    res.status(500).json({data:"Internal Server error"})
}
}

module.exports = {signUp, logIn, forgotPassword, resetPassword}