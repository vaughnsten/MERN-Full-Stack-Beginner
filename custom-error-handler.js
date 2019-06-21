const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
    try {
        throw new Error('Oh no! Something went wrong!')
    }
    catch (err){
        next(err)
    }
})

app.use((error, req, res, next) => {
    res.end(error.message)
})

app.listen(
    1337,
    () => console.log('Web Server running on port 1337')
)