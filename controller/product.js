const InventryModel = require('../models/inventory')

const returner = require('../middleware/returner')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

exports.UserCreateOrder = async (req, res, next) => {

  const { token } = req.headers

  const schema = Joi.object(
    {
      name: Joi.string()
        .required(),
      total: Joi.number().required(),
      prize: Joi.number().required(),
      user_id:Joi.string().required(),
    })
  
  try{
    if (!token) returner('inventory', { status: 401, message: "Token required" }, res)

    const user = await jwt.verify(token, `${process.env.JWT_TOKEN}`);

    const data = await schema.validateAsync(req.body)
    const {
      name,
      total,
      prize,
      user_id
    } = data

    let instance = InventryModel({ name, total, prize, user_id})

    instance.save().then((data) => {

      const { name, total, prize, _id } = data
      const message = {
        inventory: {
          name,
          total,
          prize, _id,

        }
      }
      returner('inventory', { status: 200, message }, res) 
    })
  }catch (err) {
    returner('inventory', { status: 401, message: err['details'][0].message }, res)
  }
}

exports.UserUpdateOrderById = async (req, res) => {

  if (Object.keys(req.body).length === 0) returner('inventory', { status: 404, message: "please provide data to update" }, res)
  else {
    const { id } = req.params
    const body = req.body
    const result = await InventryModel.findOne({ _id: id })
    if (result) {
      InventryModel.findOneAndUpdate(id, body, { upsert: true }, (err, data) => {
        if (err) returner('inventory', { status: 500, message: err }, res)
        else {
          returner('inventory', { status: 200, message: "Updated Succesfully" }, res)
        }

      })
    } else {
      returner('inventory', { status: 500, message: "inventry do not exist" }, res)
    }

  }

 

}

exports.UserGetOrderById = async (req, res) => {
  
  const { id } = req.params
  const result = await InventryModel.findOne({ _id: id })
  const {
    name,
    total,
    prize
  } = result

  returner('inventory', { status: 200, message: {name,total,prize}}, res)
}


exports.UserDeleteOrderById = async (req, res) => {
  const { id } = req.params
  const result = await InventryModel.findOne({ _id: id })
  if (result) {
    await InventryModel.findOneAndDelete({ _id: id }).then((data) => {
      returner('inventory', { status: 200, message: data }, res)
    })
  } else {
    returner('inventory', { status: 500, message: "Unknown inventry can not be delete" }, res)
  }


}