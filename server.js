const express = require('express')
const bodyParser = require('body-parser')
const yargs = require('yargs')
const fs = require('fs')
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

// API paths go here

app.listen(argv.port, argv.bind, ()=> {
  console.log(`Express server listening at http://${argv.bind}:${argv.port}`)
})
