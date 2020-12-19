import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password') // -password (prounounced as minus password) removes password from token
      // the above req.user can be used in any protected route we want

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('not authorized, no token')
  }
})

export { protect }