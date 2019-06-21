const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const uuid = require('uuid/v1')
const app = express()

//generate a random id for nonce which is an html attribute used for whitelist which scripts or styles are allowed to be executed inline in the HTML code
const suid = uuid()


//body parser to parse json request for json and csp-report content types
app.use(bodyParser.json({
    type: ['json', 'application/csp-report']
}))

//define directives
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [`'none'`],
        scriptSrc: [`'nonce-${suid}'`],
        reportUri: '/csp-violation'
    }
}))

//handle post request for path /csp-violation to receive violation reports from the client
app.post('/csp-violation', (req, res, next) => {
    const { body } = req
    if (body) { 
        console.log('CSP Report Violation:')
        console.dir(body, { colors: true, depth: 5})
    }
    res.status(204).send()
})

//to disable prefetch of resources
app.use(helmet.dnsPrefetchControl({ allow: false }))

//disable app from being loaded inside an iframe
app.use(helmet.frameguard({ action: 'deny'}))

//to replace the x-powered-by header and set a fake one
app.use(helmet.hidePoweredBy({
    setTo: 'Django/1.2.1 SVN-13336'
}))

//to disable IE untrusted executions
app.use(helmet.ieNoOpen())

//to disable mime-type guessing
app.use(helmet.noSniff())

//to make the header available only for our domain
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))

//to prevent Reflected XSS attacks
app.use(helmet.xssFilter())

app.get('/', (req, res, next) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Web App</title>
    </head>
    <body>
        <span id="txtlog"></span>
        <img alt="Evil Picture" src="http://evil.com/pic.jpg">
        <script>
            alert('This does not get executed!')
        </script>
        <script src="http://evil.com/evilstuff.js"></script>
        <script nonce = "${suid}">
            document.getElementById('txtlog')
                .innerText = 'Hello World'
        </script>
        </body>
        </html>
    `)
})

app.listen(
    1341,
    () => console.log('Web Server running on port 1341')
)