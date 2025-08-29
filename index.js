const express = require('express')
const morgan = require('morgan')

const app = express()


app.use(express.json())
//app.use(morgan('tiny'))


morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :response-time :body'))


const persons = [
    {
        "id": 1,
        "name": "Arturo Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
    response.json(persons)
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

app.delete('/api/persons/', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {

    const body = request.body

    //console.log(body)

    const randowId = () => Math.floor(Math.random() * 1500)

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'the name is missing or number' })

    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    } else {
        const person = {
            id: randowId(),
            name: body.name,
            number: body.number
        }
        return response.json(persons.concat(person))
    }
})

const PORT = '3001'
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})