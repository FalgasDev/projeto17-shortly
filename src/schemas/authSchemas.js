import Joi from "joi";

export const signUpSchema = Joi.object({
  name: Joi.string().invalid('').required(),
  email: Joi.string().email().required(),
  password: Joi.string().invalid('').required(),
  confirmPassword: Joi.string().invalid('').valid(Joi.ref('password')).required()
})

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().invalid('').required()
})