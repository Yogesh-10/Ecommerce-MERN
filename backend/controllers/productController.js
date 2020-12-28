import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc Fetch all products
// @route GET/api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  //query is the thing after ques mark in url
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword, //$regex comes from mongodb
          $options: 'i', //case insensitive
        },
      }
    : {}

  const products = await Product.find({ ...keyword }) //it is empty object{} by default default and if it is matching the keyword it searches for it
  res.json(products)
})

// @desc Fetch single product
// @route GET/api/products/:id
// @access  Public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc Delete a product
// @route DELETE/api/products/:id
// @access  private/ admin

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc create a product
// @route POST/api/products
// @access  private/ admin

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'sample brand',
    category: 'sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'sample desc',
  })

  const createProduct = await product.save()
  res.status(201).json(createProduct)
})

// @desc update a product
// @route PUT/api/products/:id
// @access  private/ admin

const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product Not Found')
  }
})

// @desc Create review
// @route POST/api/products/:id/reviews
// @access  private

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    //if user already reviewed

    // the below code is finding the user from review where r.user is coming from product model and checking that if that is === logged in user(req.user._id) which is basically coming from token
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }
    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'review added' })
  } else {
    res.status(404)
    throw new Error('Product Not Found')
  }
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
}
