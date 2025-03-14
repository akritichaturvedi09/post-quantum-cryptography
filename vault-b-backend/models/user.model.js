import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    secretKey:{
      type:String,
      required:true
    },
    privateKey:{
      type:String,
    }
},{timestamps:true}
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
  });
  userSchema.method("checkPassword", async function (enteredPassword) {
    const result = await bcrypt.compare(enteredPassword, this.password);
    return result;
  });
  
  userSchema.method("accessTokenMethod", function () {
    const payload = {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
    };
    const token=jwt.sign(payload, process.env.ACCESSTOKEN_KEY, {
        expiresIn: process.env.ACCESSTOKEN_EXP,
      });
    return token
  });
  export const User = mongoose.model("User", userSchema);