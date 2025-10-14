require('dotenv').config()
const morgan = require('morgan')
const Contact = require('./models/contact')
const express = require('express')
const app = express()

const cors = require('cors')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

//app.use(morgan('tiny'))


morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :response-time :body'))


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },]

app.get('/api/persons', (request, response, next) => {
    Contact.find({}).then(result => {
        //console.log(result)
        response.json(result)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    //const id = Number(request.params.id);
    //console.log(request.params.id)
    Contact.findById(request.params.id).then(result => {
        //console.log(result)
        if (result) {
            response.json({ result })
        } else {
            response.status(400).end()
        }
    }).catch(error => next(error))
})

app.get('/info', (request, response) => {
    const now = Date();
    Contact.find({}).then(result => {
        console.log(result.length)
        response.send(`<p> PhoneBook has info for ${result.length} people<p/>
         <p> ${now} <p/>`)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id).then(result => {
        console.log(result)
        if (result) {
            response.status(204).end()
        }
        response.status(404).send({ error: '404 Not Found, the data is not in the database' })
    }).catch(error => next(error))


})

app.post('/api/persons', (request, response) => {
    const body = request.body
    //const randowId = () => Math.floor(Math.random() * 1500)
    Contact.find({ name: body.name }).then(value => {
        if (value.length == 0) {

            const contact = new Contact({
                name: body.name,
                phone: body.phone,
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


app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const contact = {
        name: body.name,
        phone: body.phone
    }

    Contact.findByIdAndUpdate(request.params.id, contact, { phone: 'field of number' }).then(result => {
        if (result) {
            response.status(200).send({ message: 'the cell number was update' })
        }
        response.status(404).send({ error: '' })
    }
    ).catch(error => next(error))
})


const errorHandle = (error, request, response, next) => {
    if (error.name == 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}



app.use(errorHandle)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})