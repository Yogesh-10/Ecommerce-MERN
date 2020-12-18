import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addToCart } from '../actions/cartActions'

const CartScreen = ({ match, history, location }) => {
  const productId = match.params.id

  // location.search comes from react router which is used to search the parameters in the url
  const qty = location.search ? Number(location.search.split('=')[1]) : 1 //the split("=")[1] - it prints the no.of.qty bcoz for eg: ?qty=2 , here 2 is of index 1 and q is of index 0

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart
  console.log(cartItems)

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty)) // passing in productid and qty because we should get both from url
    }
  }, [dispatch, productId, qty])

  return <div>cart</div>
}

export default CartScreen
