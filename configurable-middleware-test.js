const express = require('express')
const loggerMiddleware = require('./middleware-logger')
const app = express()

app.use(loggerMiddleware({
    enable: true
}))

app.listen(
    1342,
    () => console.log('Web Server running on port 1342')
)