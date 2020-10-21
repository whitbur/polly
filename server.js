const express = require('express')
const bodyParser = require('body-parser')
const yargs = require('yargs')
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
    // db.getVoteStr(req.params.voteId).then(voteStr => {
    //     res.setHeader('Content-Type', 'application/json');
    //     res.end(voteStr)
    // })

    res.json({
        pollId: "qGW1in1176wfdrgF5PdsCe",
        responses: []
    })
})

app.post('/api/vote/:voteId', (req, res) => {
    // TODO: Validate response format
    
    db.saveVote(req.params.voteId, req.body)
        .then(() => res.json(req.body))
})

/*
 * Admin only APIs
 */
const only_admin = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip !== "127.0.0.1") {
        res.status(403)
        res.json({error: "You are not authorized to take this action."})
    } else {
        next()
    }
}

app.post('/api/poll/:pollId', only_admin, (req, res) => {
    // TODO: Validate poll format

    db.savePoll(req.params.pollId, req.body)
        .then(() => res.json(req.body))
})

app.get('/api/results/:pollId', only_admin, (req, res) => {
    Promise.all([
        db.getPollStr(req.params.pollId),
        db.getVoteStrsByPollId(req.params.pollId)
    ])
    .then(([pollStr, voteStrs]) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(`{"poll":${pollStr},"votes":[${voteStrs.join()}]}`)
    })
})

app.get('/api/admin_auth', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Admin check for ${ip}`)
    res.json({admin: ip === "127.0.0.1"})
})

/*
 * Entrypoint
 */
app.listen(argv.port, argv.bind, ()=> {
    console.log(`Express server listening at http://${argv.bind}:${argv.port}`)
})
