import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc Fetch all products
// @route GET/api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1 //req.query.pageNumber is getting query from url i.e, ?pageNumber=1 , if query is there this will be set or else 1 will be set.

  //query is the thing after ques mark in url
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword, //$regex comes from mongodb
          $options: 'i', //case insensitive
        },
      }
    : {}
  const count = await Product.countDocuments({ ...keyword })
  //in below code it is empty object{} by default default and if it is matching the keyword it searches for it
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1)) // limit limits the page size, i.e if the pageSize is 2 we get only 2 products , now the problem here is which 2 products we are going to get, so we use skip
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
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

// @desc Get top rated products
// @route GET/api/products/top
// @access  public

const getTopProducts = asyncHandler(async (req, res) => {
  //finding all product and sorting by rating by ascending order so -1 .and limit only by 3 prodcts .. so we get only top 3 products
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)
  res.json(products)
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}
