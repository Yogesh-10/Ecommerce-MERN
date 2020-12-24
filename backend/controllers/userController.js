import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc User Auth and token
// @route POST/api/users/login
// @access  public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body //user entered details while login

  const user = await User.findOne({ email })
  // match password comes from user schema
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email and password')
  }
})

// @desc Register New User
// @route POST/api/users
// @access  public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('user already exists')
  }

  // user.create is same as user.save...-->user.create it is syntactical sugar for user.save
  const user = await User.create({
    name,
    email,
    password, //while creating user password is not hashed..so we hash password before saving or creating in to DB. refer to userModel .pre
  })

  // status code 201 means somethng new is created
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(404)
    throw new Error('user not found')
  }
})

// @desc User Profile
// @route GET/api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id) //req.user is basically getting id from jwt token and displaying protected route, which is their profile(comes from authMiddleware)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('user not found')
  }
})

// @desc update user profile
// @route PUT/api/users/profile
// @access Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id) //req.user is basically getting id from jwt token and displaying protected route, which is their profile(comes from authMiddleware)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('user not found')
  }
})

// @desc get all users
// @route GET/api/users
// @access Private/admin

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}) //empty object means find all users
  res.json(users)
})

// @desc Delete user
// @route DELETE/api/users/:id
// @access Private/admin

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json('User Removed')
  } else {
    res.status(404)
    throw new Error('User Not Found')
  }
  res.json(users)
})

// @desc get all users
// @route GET/api/users/:id
// @access Private/admin

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User Not Found')
  }
})

// @desc update user
// @route PUT/api/users/:id
// @access Private

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('user not found')
  }
})
// the above two functions getUserbyId and updateUser is used to update a user detail, done by admin. first we are getting the user by id by get request and updating the user with put request

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
