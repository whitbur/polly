const { promisify } = require('util')

const Redis = require('redis')
const client = Redis.createClient({host: 'redis'})
const get = promisify(client.get).bind(client)

const db = {}

db.getVoteStr = voteId => get(`vote:${voteId}`)
db.getPollStr = pollId => get(`poll:${pollId}`)

module.exports = db