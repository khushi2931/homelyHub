//user schema
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const userSchema=new mongoose.Schema(
    {
       name:{
        type:String,
        required:[true,"Please enter your name"],
        trim:true,   // '         jhf    '
        maxLength:[50,"Your name cannot be longer than 50 characters"]
       },

       email:{
        type:String,
        required:[true,"Please enter email id"],
        unique:true,
        lowercase:true,
        trim:true,
        validate: [validator.isEmail, "Please enter valid email address"]
       },

       password:{
        type:String,
        required:[true,"Please enter password"],
        minlength:[6,"Tour password must be longer than 6 characters"],
        select:false
       },

       passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (el) {
            return el === this.password;
          },
        message: "Password does not match!"
       }
       },

       phoneNumber:{
        type:String,
        required:[true,"Please enter your phone number"],
        unique:true,
        trim:true
       },

       role:{
        type:String,
        enum:["user","admin"],
        default:"user"
       },

       avatar:{
        url:{type:String},
        public_id:{type:String}
       },

       passwordChangedAt:{
        type:Date
       },

       passwordResetToken:{
        type:String,
        select:false,
        index:true
       },

       passwordResetExpires:{
        type:Date,
        select:false
       },
    },
    {timestamps:true}
)

//settings to not pass in response from server
userSchema.set("toJSON",{
    transform:function(doc,ret){
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.passwordResetToken;
        delete ret.passwordChangedAt;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret
    }
})

//password logic---hashing
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});

//login check
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare (candidatePassword,userPassword);
}

//if token is stolen and user changes password after that, then token will be invalid
userSchema.methods.changedPasswordAfter=function (JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp=parseInt(
            this.passwordChangedAt.getTime()/1000,10
        );
        return JWTTimestamp < changedTimestamp
    }
    return false;
}

//forgot pasword
userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString("hex");
    this.passwordResetToken=crypto.createHash("sha256")

    .update(resetToken)
    .digest("hex");

    this.passwordResetExpires=Date.now() +10*60*1000;
    return resetToken;
}

const User=mongoose.model("User",userSchema);
export {User};