const express = require('express')
const router = express.Router()
const { UserCreateOrder, UserGetOrderById, UserDeleteOrderById, UserUpdateOrderById } = require('../controller/product')

router.get("/user/inventry/:id", UserGetOrderById)
  .post('/user/inventry', UserCreateOrder)
  .delete("/user/inventry/delete/:id", UserDeleteOrderById)
  .put("/user/inventry/update/:id", UserUpdateOrderById)


module.exports = router