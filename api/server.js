import http from 'node:http'
import { randomUUID } from 'node:crypto'
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb'

const PORT = Number(process.env.PORT || 3001)
const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.MONGODB_DB_NAME || 'portfolio_blog'
const POSTS_COLLECTION = process.env.MONGODB_POSTS_COLLECTION || 'posts'

if (!MONGODB_URI) {
  console.error('Missing required environment variable: MONGODB_URI')
  console.error('Create a .env file from .env.example and set MONGODB_URI before running the API.')
  process.exit(1)
}


const client = new MongoClient(MONGODB_URI)
let postsCollection
let cardsCollection

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Request-ID',
    'Access-Control-Expose-Headers': 'X-Request-ID',
    'Content-Type': 'application/json; charset=utf-8',
  })
  res.end(JSON.stringify(data, null, 2))
}

function serializePost(post) {
  if (!post) return null

  return {
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    views: Number(post.views || 0),
  }
}

function serializeCard(card) {
  if (!card) return null

  return {
    id: card._id.toString(),
    name: card.name,
    category: card.category,
    refId: card.refId,
    grading: card.grading,
    cost: Number(card.cost || 0),
    status: card.status,
    image: card.image,
    additionalImages: Array.isArray(card.additionalImages) ? card.additionalImages : [],
    salePrice: card.salePrice !== undefined ? Number(card.salePrice) : undefined,
    shippingType: card.shippingType,
    shippingCharged: card.shippingCharged !== undefined ? Number(card.shippingCharged) : undefined,
    trackingNumber: card.trackingNumber,
    notes: card.notes,
    dateAdded: card.dateAdded,
    dateSold: card.dateSold,
    details: card.details,
  }
}

function getCardIdFromPath(pathname) {
  const match = pathname.match(/^\/cards\/([^/]+)$/)
  return match?.[1]
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk

      if (body.length > 5_000_000) { // Limit body size to 5MB (for multiple images)
        reject(new Error('Request body is too large.'))
        req.destroy()
      }
    })

    req.on('end', () => {
      if (!body.trim()) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('Invalid JSON body.'))
      }
    })

    req.on('error', reject)
  })
}

function validatePostInput(data) {
  const errors = []

  if (typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('title is required and must be a non-empty string.')
  }

  if (typeof data.content !== 'string' || !data.content.trim()) {
    errors.push('content is required and must be a non-empty string.')
  }

  return errors
}

function getPathname(req) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  return url.pathname
}

function getPostIdFromPath(pathname) {
  const match = pathname.match(/^\/posts\/([^/]+)$/)
  return match?.[1]
}

function getPostViewIdFromPath(pathname) {
  const match = pathname.match(/^\/posts\/([^/]+)\/view$/)
  return match?.[1]
}

function parseObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null
}

const server = http.createServer(async (req, res) => {
  const pathname = getPathname(req)
  const reqId = req.headers['x-request-id'] || randomUUID()
  res.setHeader('X-Request-ID', reqId)
  console.log(`📌 [${new Date().toISOString()}] [ReqID: ${reqId}] ${req.method} ${pathname}`)

  try {
    if (req.method === 'OPTIONS') {
      sendJson(res, 204, {})
      return
    }

    if (req.method === 'GET' && pathname === '/') {
      sendJson(res, 200, {
        name: 'Portfolio Blog API',
        database: {
          provider: 'MongoDB',
          dbName: DB_NAME,
          collection: POSTS_COLLECTION,
        },
        resources: {
          posts: {
            list: 'GET /posts',
            create: 'POST /posts',
            detail: 'GET /posts/:id',
            addView: 'POST /posts/:id/view',
            delete: 'DELETE /posts/:id',
          },
          analytics: {
            topPosts: 'GET /analytics/top-posts',
          },
        },
      })
      return
    }


    if (req.method === 'GET' && pathname === '/analytics/top-posts') {
      const posts = await postsCollection
        .find({})
        .sort({ views: -1, createdAt: -1, _id: -1 })
        .limit(3)
        .toArray()

      sendJson(res, 200, {
        data: posts.map(serializePost),
        count: posts.length,
      })
      return
    }

    if (req.method === 'GET' && pathname === '/posts') {
      const posts = await postsCollection
        .find({})
        .sort({ createdAt: -1, _id: -1 })
        .toArray()

      sendJson(res, 200, {
        data: posts.map(serializePost),
        count: posts.length,
      })
      return
    }

    if (req.method === 'POST' && pathname === '/posts') {
      const body = await readJsonBody(req)
      const errors = validatePostInput(body)

      if (errors.length) {
        sendJson(res, 400, { error: 'Validation failed.', details: errors })
        return
      }

      const post = {
        title: body.title.trim(),
        content: body.content.trim(),
        createdAt: new Date().toISOString(),
        views: 0,
      }

      const result = await postsCollection.insertOne(post)

      sendJson(res, 201, {
        data: serializePost({ _id: result.insertedId, ...post }),
      })
      return
    }

    if (req.method === 'GET' && pathname === '/cards') {
      const cards = await cardsCollection
        .find({})
        .sort({ dateAdded: -1, _id: -1 })
        .toArray()

      sendJson(res, 200, {
        data: cards.map(serializeCard),
        count: cards.length,
      })
      return
    }

    if (req.method === 'POST' && pathname === '/cards') {
      const body = await readJsonBody(req)
      if (!body.name || !body.refId) {
        sendJson(res, 400, { error: 'name and refId are required.' })
        return
      }

      const card = {
        name: body.name,
        category: body.category || 'One Piece',
        refId: body.refId,
        grading: body.grading || 'Raw',
        cost: Number(body.cost || 0),
        status: body.status || 'available',
        image: body.image,
        additionalImages: Array.isArray(body.additionalImages) ? body.additionalImages : [],
        dateAdded: body.dateAdded || new Date().toISOString().split('T')[0],
        details: body.details || '',
      }

      const result = await cardsCollection.insertOne(card)
      sendJson(res, 201, {
        data: serializeCard({ _id: result.insertedId, ...card }),
      })
      return
    }

    const cardId = getCardIdFromPath(pathname)

    if (cardId && req.method === 'POST') {
      const objectId = parseObjectId(cardId)
      if (!objectId) {
        sendJson(res, 400, { error: 'Invalid card id.' })
        return
      }

      const body = await readJsonBody(req)
      
      const updateData = {
        name: body.name,
        category: body.category,
        refId: body.refId,
        grading: body.grading,
        cost: Number(body.cost || 0),
        status: body.status,
        image: body.image,
        additionalImages: Array.isArray(body.additionalImages) ? body.additionalImages : [],
        details: body.details,
      }

      if (body.status === 'sold') {
        updateData.salePrice = Number(body.salePrice || 0)
        updateData.shippingType = body.shippingType
        updateData.shippingCharged = body.shippingType === 'shipping' ? Number(body.shippingCharged || 0) : 0
        updateData.trackingNumber = body.shippingType === 'shipping' ? body.trackingNumber : ''
        updateData.notes = body.notes
        updateData.dateSold = body.dateSold || new Date().toISOString().split('T')[0]
      } else {
        updateData.salePrice = undefined
        updateData.shippingType = undefined
        updateData.shippingCharged = undefined
        updateData.trackingNumber = undefined
        updateData.notes = undefined
        updateData.dateSold = undefined
      }

      const updateDoc = {}
      const unsetDoc = {}
      for (const key in updateData) {
        if (updateData[key] === undefined) {
          unsetDoc[key] = ""
        } else {
          updateDoc[key] = updateData[key]
        }
      }

      const updateObj = { $set: updateDoc }
      if (Object.keys(unsetDoc).length > 0) {
        updateObj.$unset = unsetDoc
      }

      const updatedCard = await cardsCollection.findOneAndUpdate(
        { _id: objectId },
        updateObj,
        { returnDocument: 'after' }
      )

      if (!updatedCard) {
        sendJson(res, 404, { error: 'Card not found.' })
        return
      }

      sendJson(res, 200, { data: serializeCard(updatedCard) })
      return
    }

    if (cardId && req.method === 'DELETE') {
      const objectId = parseObjectId(cardId)
      if (!objectId) {
        sendJson(res, 400, { error: 'Invalid card id.' })
        return
      }

      const result = await cardsCollection.deleteOne({ _id: objectId })
      if (result.deletedCount === 0) {
        sendJson(res, 404, { error: 'Card not found.' })
        return
      }

      sendJson(res, 200, { data: { id: cardId, deleted: true } })
      return
    }

    const postViewId = getPostViewIdFromPath(pathname)

    if (postViewId && req.method === 'POST') {
      const objectId = parseObjectId(postViewId)

      if (!objectId) {
        sendJson(res, 400, { error: 'Invalid post id.' })
        return
      }

      const post = await postsCollection.findOneAndUpdate(
        { _id: objectId },
        { $inc: { views: 1 } },
        { returnDocument: 'after' },
      )

      if (!post) {
        sendJson(res, 404, { error: 'Post not found.' })
        return
      }

      sendJson(res, 200, { data: serializePost(post) })
      return
    }

    const postId = getPostIdFromPath(pathname)

    if (postId && req.method === 'GET') {
      const objectId = parseObjectId(postId)

      if (!objectId) {
        sendJson(res, 400, { error: 'Invalid post id.' })
        return
      }

      const post = await postsCollection.findOne({ _id: objectId })

      if (!post) {
        sendJson(res, 404, { error: 'Post not found.' })
        return
      }

      sendJson(res, 200, { data: serializePost(post) })
      return
    }

    if (postId && req.method === 'DELETE') {
      const objectId = parseObjectId(postId)

      if (!objectId) {
        sendJson(res, 400, { error: 'Invalid post id.' })
        return
      }

      const result = await postsCollection.deleteOne({ _id: objectId })

      if (result.deletedCount === 0) {
        sendJson(res, 404, { error: 'Post not found.' })
        return
      }

      sendJson(res, 200, {
        data: {
          id: postId,
          deleted: true,
        },
      })
      return
    }

    sendJson(res, 404, {
      error: 'Route not found.',
      availableRoutes: [
        'GET /posts',
        'POST /posts',
        'GET /posts/:id',
        'POST /posts/:id/view',
        'DELETE /posts/:id',
        'GET /analytics/top-posts',
        'GET /cards',
        'POST /cards',
        'POST /cards/:id',
        'DELETE /cards/:id',
      ],
    })
  } catch (error) {
    console.error(error)
    sendJson(res, 500, {
      error: 'Internal server error.',
      message: error instanceof Error ? error.message : 'Unknown error.',
    })
  }
})

async function start() {
  await client.connect()
  const db = client.db(DB_NAME)
  postsCollection = db.collection(POSTS_COLLECTION)
  cardsCollection = db.collection('cards')
  await postsCollection.createIndex({ createdAt: -1 })
  await postsCollection.createIndex({ views: -1, createdAt: -1 })
  await cardsCollection.createIndex({ dateAdded: -1 })

  server.listen(PORT, () => {
    console.log(`🚀 Blog API is running at http://localhost:${PORT}`)
    console.log(`🍃 Connected to MongoDB database: ${DB_NAME}`)
    console.log('🧪 Ready to test: POST /posts/:id/view and GET /analytics/top-posts')
  })
}

async function shutdown() {
  console.log('Shutting down Blog API...')
  server.close(async () => {
    await client.close()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

start().catch((error) => {
  console.error('Failed to start Blog API.')
  console.error(error)
  process.exit(1)
})


