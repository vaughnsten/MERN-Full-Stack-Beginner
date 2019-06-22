const express = require('express')
const app = express()

app.get('*', (req, res, next) => {
    res.send('Hello there!')
})

app.listen(
    1338,
    () => console.log('Web Server running on port 1338')
)