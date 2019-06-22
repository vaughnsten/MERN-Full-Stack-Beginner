const express = require('express')
const uuid = require('uuid')
const app = express()

//in memory database
let data = [
    { id: uuid(), name: 'Bob' },
    { id: uuid(), name: 'Alice' }
]

//model which contain functions for making CRUD operations
const usr = { 
    create(name) {
        const user = { id: uuid(), name }
        data.push(user)
        return user
    },
    read(id){
        if(id === 'all') return data
        return data.find(user => user.id === id)
    },
    update(id, name) {
        const user = data.find(usr => usr.id === id)
        if (!user) return { status: 'User not found'}
        user.name = name
        return user
    },
    delete(id){
        data = data.filter(user => user.id !== id)
        return { status: 'deleted', id }
    }
}

//a request handler for the post method that will be used as a create operation
app.post('/users/:name', (req, res) => {
    res.status(201).json(usr.create(req.params.name))
})

//request handler for the get method that will be used as a read or retrieve operation
app.get('/users/:id', (req, res) => {
    res.status(200).json(usr.read(req.params.id))
})

//request handler for the put method that will be used as an update operation
app.put('/users/:id=:name', (req, res) => {
    res.status(200).json(usr.update(
        req.params.id,
        req.params.name
    ))
})

//request handler for the delete method that will be used as a delete operation
app.delete('/users/:id', (req, res) => {
    res.status(200).json(usr.delete(req.params.id))
})

app.listen(
    1340,
    () => console.log('Web Server running on port 1340')
)