const mongoose = require('mongoose')

const password = process.argv[2]

if (!password) {
    console.log('give password as argument')
    process.exit(1)
}

const url = `mongodb+srv://fullstack:${password}@cluster0.jbgthid.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)


const phoneBookSchema = new mongoose.Schema({
    name: String,
    phone: Number,
})

const Contact = mongoose.model('Contact', phoneBookSchema)

if (process.argv.length == 3) {
    Contact.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(contact => {
            console.log(contact.name, contact.phone)
        })
        mongoose.connection.close()
    })
    return;
}

const contact = new Contact({
    name: process.argv[3],
    phone: process.argv[4],
})

contact.save().then(result => {
    console.log(`added ${result.name} number:${result.phone} to phonebook `)
    mongoose.connection.close()
})
