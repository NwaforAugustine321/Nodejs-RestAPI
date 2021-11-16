const express = require('express')
const router = express.Router()
const { UserCreate, UserProfile, UserLogin } = require('../controller/user')
const { authUser, isAdmin } = require("../middleware/auth")


router.post("/register",authUser,UserCreate)
.post("/user/profile", isAdmin, UserProfile)
.post("/user/login", UserLogin)


module.exports = router