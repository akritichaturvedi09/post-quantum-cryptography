import { Router } from "express";
import { registeruser,login, uploadfile, displayFile, logout,keyEncapsulation} from "../controllers/user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
const userRouter = Router();

userRouter.route("/registeruser").post(registeruser)
userRouter.route("/login").post(login)
userRouter.route("/upload").post(authMiddleware,upload.fields([
    {
        name: "file",
        maxCount: 1,
      }
]),uploadfile)
userRouter.route("/displayfile").post(authMiddleware,displayFile)
userRouter.route("/logout").post(authMiddleware,logout)
userRouter.route("/kyber").post(authMiddleware,keyEncapsulation)

export {userRouter}