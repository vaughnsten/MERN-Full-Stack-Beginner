const mongoose = require('mongoose')
const { connection, Schema } = mongoose

mongoose.connect(
    'mongodb://localhost:27017/test', {useNewUrlParser: true}
).catch(console.error)

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    likes: [String]
})

UserSchema.method('setFullName', function setFullName(v){
    const fullName = String (v).split(' ')
    this.lastName = fullName[0] || ''
    this.firstName = fullName[1] || ''
})

UserSchema.method('getFullName', function getFullName(){
    return `${ this.lastName } ${ this.firstName }`
})

UserSchema.method('loves', function loves(stuff) {
    this.likes.push(stuff)
})

UserSchema.method('dislikes', function dislikes(stuff) {
    this.likes = this.likes.filter(str => str !== stuff)
})

const User = mongoose.model('User', UserSchema)

connection.once('connected', async () => {
    try {
        //create
        const user = new User()
        user.setFullName('Huang Jingxuan')
        user.loves('kitties')
        user.loves('strawberries')
        user.loves('snakes')
        await user.save()
        //update
        const person = await User.findOne()
            .where('firstName', 'Jingxuan')
            .where('likes').in(['strawberries', 'kitties'])
        person.dislikes('snakes')
        await person.save()
        //display
        console.log(person.getFullName())
        console.log(JSON.stringify(person, null, 4))
        //remove
        await user.remove()
    } catch (error) {
        console.dir(error.message, { colors: true })
    } finally {
        await connection.close()
    }
})