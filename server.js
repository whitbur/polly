require("dotenv").config()

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const yargs = require('yargs')
const path = require('path')
const redis = require('redis')
const redisClient = redis.createClient({host: 'redis'})
redisClient.on('error', console.error)
const redisStore = require('connect-redis')(session)

const app = express()
const db = require('./db')

const argv = yargs
    .option('bind', {
        alias: 'b',
        description: 'The server will bind to this hostname.',
        type: 'string',
        default: '0.0.0.0'
    })
    .option('port', {
        alias: 'p',
        description: 'The server will bind to this port.',
        type: 'number',
        default: 3000
    })
    .help('h')
    .alias('h', 'help')
    .argv

app.use(express.static('client/build'))
app.use(bodyParser.json())
app.use(session({
    secret: process.env.SECRET || 'ThisIsInsecurePleaseSetEnvSecret',
    name: '_tinypoll',
    resave: false,
    saveUninitialized: true,
    store: new redisStore({client: redisClient})
}))

/*
 * Unrestricted APIs
 */
app.get('/api/poll/:pollId', (req, res) => {
    db.getPollStr(req.params.pollId).then(pollStr => {
        res.setHeader('Content-Type', 'application/json');
        res.end(pollStr)
    })
})

app.get('/api/vote/:voteId', (req, res) => {
    db.getVoteStr(req.params.voteId).then(voteStr => {
        res.setHeader('Content-Type', 'application/json');
        res.end(voteStr)
    })
})

app.post('/api/vote/:voteId', (req, res) => {
    // TODO: Validate response format
    
    db.saveVote(req.params.voteId, req.body)
        .then(() => res.json(req.body))
        .catch(e => {
            console.log(`Error while saving vote ${req.params.voteId}`)
            console.log(e)
            res.status(500)
            res.json({error: JSON.stringify(e)})
        })
})

app.post('/api/set_pass', (req, res) => {
    req.session.password = req.body.password
    res.json({ok: true})
})

/*
 * Admin only APIs
 */
const only_admin = (req, res, next) => {
    const authorized = req.session.password &&
            process.env.ADMIN_PASSWORD &&
            req.session.password === process.env.ADMIN_PASSWORD
    if (!authorized) {
        res.status(403)
        res.json({error: "You are not authorized to take this action."})
    } else {
        next()
    }
}

app.get('/api/poll/:pollId/voteIds', only_admin, (req, res) => {
    db.getVoteIdsByPollId(req.params.pollId)
    .then(voteIds => res.json(voteIds))
})

app.get('/api/poll/:pollId/votes', only_admin, (req, res) => {
    db.getVoteMapByPollId(req.params.pollId)
    .then(voteMap => res.json(voteMap))
})

app.post('/api/poll/:pollId', only_admin, (req, res) => {
    // TODO: Validate poll format

    db.savePoll(req.params.pollId, req.body)
        .then(() => res.json(req.body))
})

app.get('/api/poll/:pollId/createVotes', only_admin, (req, res) => {
    db.createVotes(req.params.pollId, parseInt(req.query.numVotes) || 10)
        .then(newVoteIds => res.json(newVoteIds))

})

app.get('/api/admin_auth', (req, res) => {
    const authorized = req.session.password &&
            process.env.ADMIN_PASSWORD &&
            req.session.password === process.env.ADMIN_PASSWORD
    console.log(`Admin check ${authorized ? 'successful' : 'unsuccessful'} for ${req.headers['x-forwarded-for']}`)
    res.json({admin: authorized == true })
})

/*
 * Fallback to react router
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
})

/*
 * Entrypoint
 */
app.listen(argv.port, argv.bind, ()=> {
    console.log(`Express server listening at http://${argv.bind}:${argv.port}`)
})
