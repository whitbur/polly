const { promisify } = require('util')
const short = require('short-uuid')

const Redis = require('redis')
const client = Redis.createClient({host: 'redis'})
const get = promisify(client.get).bind(client)
const mget = promisify(client.mget).bind(client)
const mset = promisify(client.mset).bind(client)
const sadd = promisify(client.sadd).bind(client)
const set = promisify(client.set).bind(client)
const smembers = promisify(client.smembers).bind(client)

const db = {}

db.getPollStr = pollId => get(`poll:${pollId}`)
db.getVoteStr = voteId => get(`vote:${voteId}`)
db.savePoll = (pollId, poll) => set(`poll:${pollId}`, JSON.stringify(poll))
db.saveVote = (voteId, newVote) => get(`vote:${voteId}`).then(oldVoteStr => {
    if (oldVoteStr) {
        const oldVote = JSON.parse(oldVoteStr)
        const vote = {...oldVote, lastUpdate: new Date(), responses: newVote.responses}
        return set(`vote:${voteId}`, JSON.stringify(vote), 'XX')
    } else {
        throw "Vote must exist to be saved."
    }
})

db.getVoteIdsByPollId = pollId => smembers(`poll:${pollId}:voteIds`)
db.getVoteMapByPollId = pollId => smembers(`poll:${pollId}:voteIds`)
    .then(voteIds => {
        const voteMap = {}
        if (voteIds.length == 0) return voteMap
        return mget(voteIds.map(voteId => `vote:${voteId}`))
            .then(votes => {
                for (var i = 0; i < votes.length; i++) {
                    if (votes[i] != null) {
                        voteMap[voteIds[i]] = JSON.parse(votes[i])
                    }
                }
                return voteMap
            })
    })

db.createVotes = (pollId, numVotes) => {
    const newVote = {pollId: pollId, createDate: new Date(), lastUpdate: new Date(), responses: []}
    const newVoteStr = JSON.stringify(newVote)
    const newVoteIds = [...Array(numVotes)].map(() => short.generate())
    const msetArgs = newVoteIds.map(voteId => [`vote:${voteId}`, newVoteStr]).flat()

    return Promise.all([
        mset(...msetArgs),
        sadd(`poll:${pollId}:voteIds`, newVoteIds)
    ]).then(() => {
        const voteMap = {}
        newVoteIds.forEach(voteId => {
            voteMap[voteId] = newVote
        })
        return voteMap
    })
}

module.exports = db