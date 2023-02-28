import { Router } from "express";
import { createShortUrl, getUrlById } from "../controllers/urlsController.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { shortUrlSchema } from "../schemas/urlsSchemas.js";

const urlRouter = Router()

urlRouter.post('/urls/shorten', tokenValidation, validateSchema(shortUrlSchema), createShortUrl)
urlRouter.get('/urls/:id', getUrlById)

export default urlRouter
