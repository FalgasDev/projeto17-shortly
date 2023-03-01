import { Router } from "express";
import { getUserLinks } from "../controllers/usersController.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const userRouter = Router()

userRouter.get('/users/me', tokenValidation, getUserLinks)

export default userRouter