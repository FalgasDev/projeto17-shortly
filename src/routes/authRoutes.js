import { Router } from "express";
import { signUp } from "../controllers/authController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { signUpSchema } from "../schemas/authSchemas.js";

const authRouter = Router()

authRouter.post('/signup', validateSchema(signUpSchema), signUp)

export default authRouter