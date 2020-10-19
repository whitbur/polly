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

app.get('/api/poll/:pollId', (req, res) => {
    const pollId = req.params.pollId
    
    db.getPollStr(pollId).then(pollStr => {
        res.setHeader('Content-Type', 'application/json');
        res.end(pollStr)
    })
})

app.get('/api/vote/:voteId', (req, res) => {
    const voteId = req.params.voteId

    // db.getVoteStr(voteId).then(voteStr => {
    //     res.setHeader('Content-Type', 'application/json');
    //     res.end(voteStr)
    // })

    res.json({
        pollId: "qGW1in1176wfdrgF5PdsCe",
        responses: []
    })
})

app.post('/api/vote/:voteId', (req, res) => {
    const voteId = req.params.voteId
    const vote = req.body

    // TODO: Validate response format
    
    db.saveVote(voteId, vote)
        .then(() => res.json(vote))
})

app.post('/api/poll/:pollId', (req, res) => {
    const pollId = req.params.pollId
    const poll = req.body

    // TODO: Validate poll format

    db.savePoll(pollId, poll)
        .then(() => res.json(poll))
})

app.get('/api/admin_auth', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Admin check for ${ip}`)
    res.json({admin: ip === "127.0.0.1"})
})

app.listen(argv.port, argv.bind, ()=> {
    console.log(`Express server listening at http://${argv.bind}:${argv.port}`)
})
