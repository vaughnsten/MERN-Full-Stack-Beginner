const express = require('express')
const app = express()
const debug = require('debug')('myapp')

app.get('*', (req, res, next) => {
    debug('Request:', req.originalUrl)
    res.send('Hello World!')
})

app.listen(
    1339,
    () => console.log('Web Server running on port 1339')
)


//set DEBUG=myapp node myapp.js || set DEBUG=myapp,express:* node myapp.js
//linux/MacOS: DEBUG=myapp node myapp.js || DEBUG=myapp,express:* node myapp.js