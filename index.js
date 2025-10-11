require('dotenv').config()
const morgan = require('morgan')
const Contact = require('./models/contact')
const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())
app.use(express.json())
//app.use(morgan('tiny'))
app.use(express.static('dist'))

morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :response-time :body'))


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },]

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(result => {
        console.log(result)
        response.json(result)
    })
})

app.get('/info', (request, response) => {
    const now = Date();
    response.send(`<p> PhoneBook has info for ${persons.length} people<p/>
         <p> ${now} <p/>`)

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    console.log(id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id).then(result => {
        console.log(result)
        response.status(200).end()
    }).catch(error => next(error))


})

app.post('/api/persons', (request, response) => {
    const body = request.body
    //const randowId = () => Math.floor(Math.random() * 1500)

    Contact.find({ name: body.name }).then(value => {
        if (value.length == 0) {

            const contact = new Contact({
                name: body.name,
                phone: body.number,
            })

            contact.save().then(result => {
                console.log('note saved!')
                return response.status(200).json(result)
            })

        } else {
            return response.status(400).json({ error: 'the name is missing or number' })
        }

    })

    /*Contact.find({}).then(result => {
         result.find(contact => {
             if (contact.name === body.name) {
                 return response.status(400).json({ error: 'the name is missing or number' })
             }
         })
     }).then(value => {
         if (!value) {
 
             const contact = new Contact({
                 name: body.name,
                 phone: body.phone,
             })
 
             contact.save().then(result => {
                 console.log('note saved!')
                 //return response.json(result)
             })
         }
     })*/



    /*if (!body.name || !body.number) {
        return response.status(400).json({ error: 'the name is missing or number' })

    } 

    else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    } else {
        const person = {
            id: randowId(),
            name: body.name,
            number: body.number
        }
        return response.json(persons.concat(person))
    }*/
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})