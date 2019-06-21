const express = require('express')
const app = express()
const router = express.Router()

router.use((request, response, next) => {
    console.log('URL:', request.originalUrl)
    next()
})

app.use('/router', router)

app.listen(
    1343, 
    () => console.log('Web Server running on port 1343')
)