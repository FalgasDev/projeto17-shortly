import bcrypt from "bcrypt"
import { db } from "../config/database.connection.js";

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