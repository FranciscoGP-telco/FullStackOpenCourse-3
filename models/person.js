const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => {
        console.log('connected!')
    })
    .catch((error) => {
        console.log(`Error connecting to MongoDB: ${error}`)
    })


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: [true, 'You must insert a name']
    },
    number: {
        type: String,
            validate: {
                validator: function(v) {
                return /\d{2,3}-\d{8}/.test(v)
            },
            message: props => `${props.value} The number introduced is not a correct number!`
        },
        required: [true, 'You must insert a phone number']
    }
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
