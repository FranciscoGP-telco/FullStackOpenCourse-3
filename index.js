require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const app = express()
const PORT = process.env.PORT

morgan.token('body', function (req, res) { 
  return JSON.stringify(req.body)
})



app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.get('/', (request, response) => {
    response.send("<h1>Test for exercise 3.1</h1>")
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(person => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
      .catch(error => next(error))
    
})

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server initialized in port ${PORT}`)
})
