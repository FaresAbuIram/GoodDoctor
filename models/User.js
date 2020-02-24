const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    appointment: {
        type: Array,
    },
    belongTo :{
        type: String
    }
})


const User = mongoose.model('User', UserSchema);

module.exports = User;


