const express = require('express')
const app = express()
const PORT = 3001

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
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

app.get('/', (request, response) => {
    response.send("<h1>Test for exercise 3.1</h1>")
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    } else {
        response.statusMessage = "Can't find the person"
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    let numberOfPersons = persons.length
    let currentHour = new Date();
    response.send(
        `<p>Phonebook has info for ${numberOfPersons} people</p>
        <p>${currentHour}</p>`
    )
})
app.listen(PORT, () => {
    console.log(`Server initialized in port ${PORT}`)
})
