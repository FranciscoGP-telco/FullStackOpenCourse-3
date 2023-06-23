const mongoose = require('mongoose')

switch (process.argv.length) {
    case 3:
        console.log('show DB content')
        listPersons(connect())
        break;

    case 5:
        const name = process.argv[3]
        const number = process.argv[4]
        console.log('add a person to the DB')
        addPerson(name, number, connect())
        break;

    default:
        console.log('Invalidad number of parameters')
}

function url () {
    const password = process.argv[2]
    return `mongodb+srv://pakoska:${password}@cluster0.ujcycav.mongodb.net/phonebookApp?retryWrites=true&w=majority`
}
  
function connect () {
    mongoose.set('strictQuery',false)
    mongoose.connect(url())
    
    
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    })
    
    const Person = mongoose.model('Person', personSchema)

    return Person
}


function addPerson (name, number, Person) {
    const person = new Person({
        name: name,
        number: number,
      })
      
      person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
      })
}

function listPersons (Person) {
    Person.find({}).then(result => {
        console.log('phonebook')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
