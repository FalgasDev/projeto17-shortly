import { nanoid } from "nanoid";
import { db } from "../config/database.connection.js";

export async function createShortUrl(req, res) {
  const {url} = req.body
  const session = res.locals.session
  const shortUrl = nanoid(8)

  try {
    await db.query('INSERT INTO urls (url, "shortenUrl", "userId") VALUES ($1, $2, $3)', [url, shortUrl, session.userId])

    const lastId = await db.query('SELECT max(id) as "lastestId" FROM urls')

    res.status(201).send({
      id: lastId.rows[0].lastestId,
      shortUrl: shortUrl
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function getUrlById(req, res) {
  const {id} = req.params

  try {
    const url =  await db.query('SELECT * FROM urls WHERE id = $1', [id])

    if (url.rowCount === 0) return res.sendStatus(404)

    res.send({
      id: id,
      shortUrl: url.rows[0].shortenUrl,
      url: url.rows[0].url
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function openUrl(req, res) {
  const {shortUrl} = req.params

  try {
    const link = await db.query('SELECT * FROM urls WHERE "shortenUrl" = $1', [shortUrl])

    if (link.rowCount === 0) return res.sendStatus(404)

    await db.query('UPDATE urls SET "visitCount" = $1 WHERE id = $2', [link.rows[0].visitCount + 1, link.rows[0].id])

    res.redirect(link.rows[0].url)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function deleteUrl(req, res) {
  const {id} = req.params
  const session = res.locals.session

  try {
    const url = await db.query('SELECT * FROM urls WHERE id = $1', [id])

    if (url.rowCount === 0) return res.sendStatus(404)
    if (session.userId !== url.rows[0].userId) return res.sendStatus(401)

    await db.query('DELETE FROM urls WHERE id = $1', [id])

    res.sendStatus(204)
  } catch (err) {
    res.status(500).send(err.message)
  }
}