const jwt = require('jsonwebtoken')
const User = require('../models/user.js')
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const returner = require('../middleware/returner')

const authUser = async(req, res,cb) => {
    // VALIDATE REQ.BODY
  try {
    const schema = Joi.object(
      {
        name: Joi.string()
          .required(),
        password: Joi.string().required(),
        repeat_password: Joi.required(),
        email: Joi.string().email().required(),
        admin:Joi.boolean().required()

      })
    await schema.validateAsync(req.body).then(async (data) => {
      const { email } = data

      //FIND USER IN DB
      await User.findOne({ email: email })
        .then(async (user) => {
          if (user) {
            message = 'user already exist'
            returner('auth',{status:404,message:message},res)
            cb()
          }
          const token = jwt.sign(data, `${process.env.JWT_TOKEN}`, { expiresIn: '1d' });
          req.accessToken = token
          cb()

        }).catch((err) => {
          returner('auth', { status: 500, message: err }, res)
          cb()
        })
    }).catch((err) => {
      returner('auth', { status: 404, message: err["details"][0].message}, res)
    })
  } catch (err) {
    
   } 
}

const isAdmin = async (req, res, cb) => {
  // CHECK USER ISADMIN
  const {name} = req.body
  try {
    const { token } = req.headers
    if (token) {
      //FIND USER IN DB
      await User.findOne({ name: name})
        .then(async (user) => {
          if (user && user.admin === true) {
            message = 'User is  admin'
            const decode = jwt.verify(token, `${process.env.JWT_TOKEN}`);
            req.user = decode
            cb()
          } else {
            returner('admin', { status: 401, message: 'Unauthorize Amdin' }, res)
            cb()
          }
          
        }).catch((err) => {
          returner('admin', { status: 500, message: err }, res)
          cb()
        })
    } else {
      returner('admin', { status: 401, message: 'Token required' }, res)
      cb()
    }
    
   

  } catch (err) {

  }
}

module.exports = { authUser, isAdmin }