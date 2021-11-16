const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema =  mongoose.Schema({
  name: String,
  email: {
    type:String,
    unique:true,
    required: true
  },
  password : String,
  repeat_password:String,
  url: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
    required:true
  }

}, { timestamps: true })

userSchema.methods.decryptPassword = async function (plainPassword)  {
  await bcrypt.compare(plainPassword,this.password)
}

userSchema.pre('save', async function(next) {
  if (!this.isModified("password")) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  this.repeat_password = this.password
})

module.exports = new mongoose.model('User',userSchema)