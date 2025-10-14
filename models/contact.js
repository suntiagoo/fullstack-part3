require('dotenv').config()
const mongoDB = require('./index')


const phoneBookSchema = new mongoDB.Schema({
    name: String,
    phone: Number,
})

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoDB.model('Contact', phoneBookSchema)
