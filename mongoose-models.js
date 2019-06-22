const mongoose = require('mongoose')
const { connection, Schema } = mongoose

mongoose.connect(
    'mongodb://localhost:27017/test', {useNewUrlParser: true} 
).catch(console.error)

const UserSchema = new Schema ({
    firstName: String,
    lastName: String,
    likes: [String],
})

const User = mongoose.model('User', UserSchema)

const addUser = (firstName, lastName) => new User({
    firstName,
    lastName
}).save()

const getUser = (id) => User.findById(id)

const removeUser = (id) => User.deleteMany({ id })

connection.once('connected', async () => {
    try {
        //create
        const newUser = await addUser('John', 'Smith')
        //read
        const user = await getUser(newUser.id)
        //update
        user.firstName = 'Jonny'
        user.lastName = 'Smithy'
        user.likes = [
            'cooking',
            'watching movies',
            'ice cream'
        ]
        await user.save()
        console.log(JSON.stringify(user, null, 4))
        //delete
        await removeUser(user.id)
    } catch (error) {
        console.dir(error.message, { colors: true})
    } finally {
        await connection.close()
    }
})