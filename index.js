require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

const PORT = process.env.PORT

morgan.token('body', function (req, res) { 
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
//app.use(express.static('build'))
app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.send("<h1>Test for exercise 3.1</h1>")
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
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
  Person.findByIdAndDelete(request.params.id)
    .then(person => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})

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
      
    Person.find({name: body.name})
      .then((personFind) => {
        if(personFind.length === 0){
          const person = new Person({
            name: body.name,
            number: body.number
          })
          
          person.save()
            .then(savedPerson => {
              response.json(savedPerson)
          })
        } else {
          return response.status(400).json({ 
            error: 'Name duplicated in the DB' 
          })
        }
      })
    

})


app.listen(PORT, () => {
    console.log(`Server initialized in port ${PORT}`)
})
