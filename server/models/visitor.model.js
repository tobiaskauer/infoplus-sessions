const { Schema, model } = require('mongoose')

const VisitorSchema = new Schema({
    category: {
        type: String,
    },
    browserOrigin: {
        type: String
    },

    browserLanguage: {
        type: String
    },

    duration: {
        type: Number,
    },
},{ timestamps: true })

const Visitor = model('visitor', VisitorSchema)

module.exports = Visitor