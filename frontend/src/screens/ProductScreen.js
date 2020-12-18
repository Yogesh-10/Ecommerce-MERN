import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from '../components/Rating';
import { listProductDetails } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductScreen = ({ match }) => {
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);

  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(match.params.id));
  }, [match, dispatch]);

  //  ***** the below method was used before setting up redux, now the above method is fired off from actions in redux ****//

  // const [product, setProduct] = useState({});
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     const { data } = await axios.get(`/api/products/${match.params.id}`);

  //     setProduct(data);
  //   };

  //   fetchProduct();
  // }, [match]);

  //***OR WE CAN ALSO USE THE BELOW FETCH METHOD INSTEAD OF AXIOS.BOTH WORKS SAME ***

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     const res = await fetch(`/api/products/${match.params.id}`);
  //     const data = await res.json();
  //     setProduct(data);
  //   };
  //   fetchProduct();
  // }, []);

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid></Image>
          </Col>
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>

              <ListGroup.Item>price: ${product.price}</ListGroup.Item>

              <ListGroup.Item>
                Description: ${product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>{product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? 'In stock' : 'Out of Stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Button
                    className='btn-clock'
                    type='button'
                    disabled={product.countInStock === 0}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
