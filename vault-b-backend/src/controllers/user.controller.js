import mongoose from "mongoose";
import { User } from "../../models/user.model.js";
import { Doc } from "../../models/doc.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { handleCloudinary } from "../../utils/cloudinary.js";
import crypto from "crypto";
import  kyberKeyEncapsulation from "../../utils/kyberKeyEncapsulation.js";
import { log } from "console";
import pkg from 'kyber-crystals';
import AesKeyEncryption from "../../utils/aesKeyEncrypt.js";
const { kyber } = pkg;
// function for generating tokens
const accessTokenAndRefreshToken = async (user) => {
  const accessToken = user.accessTokenMethod();
  return { accessToken };
};

// registeruser
const registeruser = asyncHandler(async (req, res, next) => {
  const { fullname, email, password } = req.body;
  if ([fullname, email, password].some((field) => field?.trim() === "")) {
    throw new apiError(400, "field can not be empty");
  }
  const existed = await User.findOne({ email });
  console.log(existed);
  if (existed)
    throw new apiError(400, "user already existed with given details");
  const secretKey = crypto.randomBytes(32).toString("base64");
  const user = await User.create({
    fullname,
    email,
    password,
    secretKey
  });
  const data = await User.findById(user._id).select("-password");
  res.status(201).json(new apiResponse(201, data, "success"));
});

// login
const login = asyncHandler(async (req, res, next) => {
  const { email, password} = req.body;
  // console.log(kyberPk)
  let user;
  if (email) {
    user = await User.findOne({ email });
    if (!user) throw new apiError(401, "invalid credentials");
  } else throw new apiError(400, "all fields are required");

  const checkPassword = await user.checkPassword(password);

  if (!checkPassword) {
    throw new apiError(401, "invalid credentials");
  }
  const {formatedKyberData} = await kyberKeyEncapsulation();
  const updateResponse = await User.findByIdAndUpdate(
    user._id,
    { privateKey: formatedKyberData.privateKey },
    { new: true, upsert: true } // This ensures the field is added if missing
  );
  const { accessToken } = await accessTokenAndRefreshToken(user);
  const options = {
    httpOnly: true,
    secure: true,
    sameSite:"none"
  };
  user.password = null;
  user.secretKey = null;
  // user.kyberData={...formatedKyberData};

  res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .json(new apiResponse(200, { user: user,kyberPk:formatedKyberData.publicKey }, "success"));
});

// logout
const logout = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
 
  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new apiResponse(200, {}, "Logged out successfully"));
});

//upload
const uploadfile = asyncHandler(async (req, res, next) => {
  if (!req.files.file) throw new apiError(400, "file is required");
  const localFilePath = req.files?.file[0]?.path;

  const cloudinaryUri = await handleCloudinary(localFilePath);

  const doc = await Doc.create({
    owner: req.user._id,
    filename: req.files.file[0].filename,
    fileurl: cloudinaryUri,
  });
  const data = await Doc.findById(doc._id);
  res.status(201).json(new apiResponse(200, data, "success"));
});

// displayFile
const displayFile = asyncHandler(async (req, res, next) => {
  const data = await Doc.find({owner:req.user._id})
  res.status(201).json(new apiResponse(200, data, "success"));
});

// keyEncapsulation
const keyEncapsulation = asyncHandler(async (req, res) => {
  const {cyphertext,user} = req.body;
  console.log("cyphertext1",cyphertext)
  const user2 = await User.findById(req.user._id);
  const cypherTextUint8 = new Uint8Array(Buffer.from(cyphertext, "base64"));
  const privateKeyUint8 = new Uint8Array(Buffer.from(user2.privateKey, "base64"));
  
  const decryptedSharedSecret=await kyber.decrypt(cypherTextUint8,privateKeyUint8);
  const sharedSecret = Buffer.from(decryptedSharedSecret).toString("base64");
  console.log("shared secret base64 x",sharedSecret,decryptedSharedSecret)
  const kyberAesKey = crypto.createHash("sha256").update(decryptedSharedSecret).digest(); //32-byte AES Key
  const userAesKey = user2.secretKey
  const {encryptedData} = await AesKeyEncryption(kyberAesKey,userAesKey);
  console.log(encryptedData)
  res.status(200).json(new apiResponse(200, {...encryptedData}, "success"));
}); 

export { registeruser, login, uploadfile ,displayFile,logout,keyEncapsulation};
