import bcrypt from "bcrypt"
import { db } from "../config/database.connection.js";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
  const {name, email, password} = req.body

  try {
    const hasEmail = await db.query('SELECT * FROM users WHERE email = $1', [email])

    if (hasEmail.rowCount !== 0) return res.sendStatus(409)

    const passwordHashed = bcrypt.hashSync(password, 10)

    await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, passwordHashed])

    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function signIn(req, res) {
  const {email, password} = req.body

  try {
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email])

    if (user.rowCount === 0) return res.sendStatus(401)

    if (!bcrypt.compareSync(password, user.rows[0].password)) return res.sendStatus(401)

    const userToken = await db.query('SELECT * FROM sessions WHERE "userId" = $1', [user.rows[0].id])

    const token = uuid()

    if (userToken.rowCount !== 0) {
      await db.query('UPDATE sessions SET token = $1', [token])
    } else {
      await db.query('INSERT INTO sessions (token, "userId") VALUES ($1, $2)', [token, user.rows[0].id])
    }

    res.send({token: token})
  } catch (err) {
    res.status(500).send(err.message)
  }
}