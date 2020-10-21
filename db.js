const { promisify } = require('util')

const Redis = require('redis')
const client = Redis.createClient({host: 'redis'})
const get = promisify(client.get).bind(client)
const mget = promisify(client.mget).bind(client)
const sadd = promisify(client.sadd).bind(client)
const set = promisify(client.set).bind(client)
const smembers = promisify(client.smembers).bind(client)

const db = {}

db.getPollStr = pollId => get(`poll:${pollId}`)
db.getVoteStr = voteId => get(`vote:${voteId}`)
db.savePoll = (pollId, poll) => set(`poll:${pollId}`, JSON.stringify(poll))
db.saveVote = (voteId, vote) => Promise.all([
    set(`vote:${voteId}`, JSON.stringify(vote)),
    sadd(`poll:${vote.pollId}:voteIds`, voteId)
])

db.getVoteStrsByPollId = pollId => smembers(`poll:${pollId}:voteIds`)
    .then(voteIds => voteIds.length > 0 ? mget(voteIds.map(voteId => `vote:${voteId}`)) : [])
    // TODO: Filter nil values

module.exports = db