const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

var Schema = mongoose.Schema

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 6
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    sex: {
        type: Boolean,
        required: true
    },
    address: {
        type: String,
        required: true,
        minlength: 3
    }
})

var User = mongoose.model('User', UserSchema)


mongoose.connect('mongodb://localhost:27017/UserDB').then((doc) => {
    console.log('@@@ connect to db success @@@')
}, (err) => {
    console.log('!!! failed to connect db !!!')
})

var app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('hello')
})

app.post('/signup', (req, res) => {
    let newUser = new User({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        sex: req.body.sex,
        address: req.body.address
    })

    newUser.save().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(400).send(err)
    })

})

app.get('/signin', (req, res) => {
    let usernameInput = req.headers['username']
    let passwordInput = req.headers['password']

    User.find({
        username: usernameInput,
        password: passwordInput
    }).then((user) => {
        if(user.length == 1) {
            res.send(user[0])
        }else if(user.length == 0) {
            res.status(400).send('sorry not found this user')
        }
    }, (err) => {
        res.status(400).send(err)
    })
})

app.listen(3000, () => {
    console.log('is listen on port 3000')
})
