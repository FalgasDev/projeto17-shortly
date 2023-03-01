import { db } from "../config/database.connection.js";

export async function getRanking(req, res) {
  try {
    const ranking = await db.query(`
    SELECT
      users.id,
      users.name,
      COALESCE(COUNT(urls."userId"), 0) as "linksCount",
      COALESCE(SUM(urls."visitCount"), 0) as "visitCount"
    FROM users
    LEFT JOIN urls
      ON users.id = urls."userId"
    GROUP BY users.id
    ORDER BY "visitCount" DESC
    LIMIT 10
    `)

    res.send(ranking.rows)
  } catch (err) {
    res.status(500).send(err.message)
  }
}