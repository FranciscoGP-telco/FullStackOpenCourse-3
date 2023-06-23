const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT || 3001

morgan.token('body', function (req, res) { 
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
//app.use(express.static('build'))
app.use(cors())
app.use(express.json())


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

app.get('/', (request, response) => {
    response.send("<h1>Test for exercise 3.1</h1>")
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const randomId = Math.floor(Math.random() * 1000000)
    return randomId
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name) {
      return response.status(400).json({ 
        error: 'Name missing' 
      })
    }
  
    if (!body.number) {
        return response.status(400).json({ 
          error: 'Number missing' 
        })
      }
    
      if (persons.find(person => person.name === body.name)){
        return response.status(400).json({ 
            error: 'Name already in the phonebook' 
          })
        }

    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })


app.listen(PORT, () => {
    console.log(`Server initialized in port ${PORT}`)
})
