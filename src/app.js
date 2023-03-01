import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./routes/authRoutes.js"
import urlRouter from "./routes/urlsRoutes.js"
import userRouter from "./routes/usersRoutes.js"

dotenv.config()

const server = express()
server.use(cors())
server.use(express.json())
server.use([authRouter, urlRouter, userRouter])

const port = process.env.PORT || 5000

server.listen(port, () => console.log(`O server está rodando na porta: ${port}`))