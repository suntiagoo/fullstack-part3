require('dotenv').config()
const mongoDB = require('./index')


const phoneBookSchema = new mongoDB.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) { return /\d{2,3}-\d{5,}/.test(v); },
            message: props => `${props.value} is not a valid phone number!`,
        },

        minLength: 8,
        required: true
    }
})

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoDB.model('Contact', phoneBookSchema)
