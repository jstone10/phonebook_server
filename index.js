const express = require('express')
const morgan = require('morgan')
const app = express()


let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

let endpoints = {
    persons: '/api/persons',
    person: '/api/persons/:id',
    info: '/info',
}

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))

// Use the custom token in the format string
// app.post('*', morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use((req, res, next) => {
    if (req.method === 'POST') {
        morgan(':method :url :status :res[content-length] - :response-time ms :body')
        (req, res, next)
    } else {
        morgan(':method :url :status :res[content-length] - :response-time ms')
        (req, res, next)
    }
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get(endpoints.info, (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()} </p>`
    )
})

app.get(endpoints.persons, (request, response) => {
    response.json(persons)
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000);
}

app.post(endpoints.persons, (request, response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({ 
            error: 'name missing' 
          })
    } 
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } 
    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: `${body.name} exists already`
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get(endpoints.person, (request, response) =>{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete(endpoints.person, (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})