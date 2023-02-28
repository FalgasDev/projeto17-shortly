import { db } from "../config/database.connection.js";

export async function tokenValidation(req, res, next) {
  const { authorization } = req.headers;
	const token = authorization?.replace('Bearer ', '');

	if (!token) return res.sendStatus(401);

	const session = await db.query('SELECT * FROM sessions WHERE token = $1', [token]);

	if (session.rowCount === 0) return res.sendStatus(401);

  res.locals.session = session.rows[0]

  next()
}