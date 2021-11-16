const mongoose = require('mongoose')
const Schema = require('mongoose').Schema
const itemSchema = new mongoose.Schema({

  user_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required:true
  },

  total: {
    type: Number,
    required:true
  },

  prize: {
    type: Number,
    required: true
  },
  


}, { timestamps: true })

module.exports = mongoose.model("Item",itemSchema)