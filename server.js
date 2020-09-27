const express = require('express')
const bodyParser = require('body-parser')
const yargs = require('yargs')
const redis = require('redis')
const app = express()

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

app.get('/api/vote/:voteId', (req, res) => {
  const voteId = req.params.voteId
  // TODO: Populate this from Redis
  res.json({
    poll: {
      id: 1,
      title: "Book Club Next Subject",
      questions: [
        {
          id: 1,
          type: "choose_many",
          text: "Why are you a part of this reading group?",
          allow_other: true,
          other_text: "Another reason (please specify)",
          choices: [
            {id: 1, text: "I like to read"},
            {id: 2, text: "I know some people here"},
            {id: 3, text: "The subject matter is interesting"},
            {id: 4, text: "My spouse is forcing me to come with"}
          ]
        },
        {
          id: 2,
          type: "ranked_choice",
          text: "Please rank your choices from most desired to least. Only the top four matter.",
          choices: [
            {id: 6, text: "Book one"},
            {id: 7, text: "Book Two or something"},
            {id: 8, text: "Title three - Oh right, authors"},
            {id: 9, text: "Eh, whatever"},
            {id: 10, text: "Actually we need more"},
            {id: 11, text: "... than four choices"},
            {id: 12, text: "Like, six or seven would be fantastic"}
          ]
        }
      ]
    }
  })
})

app.listen(argv.port, argv.bind, ()=> {
  console.log(`Express server listening at http://${argv.bind}:${argv.port}`)
})
