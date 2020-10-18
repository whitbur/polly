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
    
    // db.getPollStr(pollId).then(pollStr => {
    //     res.setHeader('Content-Type', 'application/json');
    //     res.end(pollStr)
    // })
    
    res.json({
        id: "qGW1in1176wfdrgF5PdsCe",
        questions: [
            {
                id: "7xKZPv5C5LRUbEvJsRvH4P",
                rank: 1,
                type: "text_display",
                title: "Book Club Next Subject",
            },
            {
                id: "o1Y8CLEhJaYKD3k8bzXmyA",
                rank: 2,
                type: "choose_many",
                text: "Why are you a part of this reading group?",
                allowOther: true, // TODO
                otherLabel: "Another reason (please specify)", // TODO
                choices: [
                    "I like to read",
                    "I know some people here",
                    "The subject matter is interesting",
                    "My spouse is forcing me to come with"
                ]
            },
            {
                id: "cTHkAMSZi3zAPNGdT2brRM",
                rank: 3,
                type: "ranked_choice",
                text: "Please rank your choices from most desired to least. Only the top four matter.",
                choices: [
                    "Book one",
                    "Book Two or something",
                    "Title three - Oh right, authors",
                    "Eh, whatever",
                    "Actually we need more",
                    "... than four choices",
                    "Like, six or seven would be fantastic"
                ]
            },
            {
                id: "dneL6MLvLLhGFAcmVmuRAd",
                rank: 4,
                type: 'choose_one',
                text: 'How many pages do you think you could read in a week?',
                allowOther: true,
                otherLabel: "A different amount",
                choices: [
                    '1-10',
                    '10-20',
                    '20-30',
                    '30-40',
                    '40-50'
                ]
            }
        ]
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

app.get('/api/admin_auth', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Admin check for ${ip}`)
    res.json({admin: ip === "127.0.0.1"})
})

app.listen(argv.port, argv.bind, ()=> {
    console.log(`Express server listening at http://${argv.bind}:${argv.port}`)
})
