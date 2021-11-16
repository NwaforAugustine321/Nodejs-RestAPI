const User = require('../models/user')
const returner = require('../middleware/returner')
const Joi = require('joi');
const jwt = require('jsonwebtoken')

exports.UserCreate = async (req, res) => {
   // create new user
  if (req.accessToken) {
    const user = await User.create(req.body)
    const {
      _id, name,
      email
    } = user
    const message = {
      _id,
      name,
      email,
      token:req.accessToken
    }
    returner("register", {
      status: 200, message: message},res)
    return;   
  } 
   
   
}

exports.UserProfile = async (req, res) => {
  res.json({
    api_name:"profile",
    ...req.user
  })
}

exports.UserLogin = async (req, res) => {
 
  try {
    const schema = Joi.object(
      {
        name: Joi.string()
          .required(),
        password: Joi.string().required(),
        repeat_password: Joi.required(),
        email: Joi.string().email().required(),

      })
    await schema.validateAsync(req.body).then(async (data) => {
      const {password,email} = data
      //FIND USER IN DB
      const { token } = req.headers
      if (!token) returner('login', { status: 401, message: "Token required"}, res)
      jwt.verify(token, `${process.env.JWT_TOKEN}`);
      await User.findOne({ email: email })
        .then(async (user ) => {
          if (user && user.decryptPassword(password)) {
            const message = 'user login sucessfully'
            returner('login', { status: 200, message: message }, res)
          } else {
            returner('login', { status: 500, message:"user do not exist"}, res)
          }
        }).catch((err) => {
          returner('login', { status: 500, message: err.message }, res)
        })
    }).catch((err) => {
      returner('login', { status: 404, message: err.message }, res)
    })
  } catch (err) {

  }
}