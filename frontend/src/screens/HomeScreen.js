import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProducts } from '../actions/productActions';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);

  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  //  ***** the below method was used before setting up redux, now the above method is fired off from actions in redux ****//

  // const [products, setProducts] = useState([]);
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data } = await axios.get('/api/products'); // destructure data directly instead of res.data

  //     setProducts(data);
  //   };
  //   fetchProducts();
  // }, []);

  //***OR WE CAN ALSO USE THE BELOW FETCH METHOD INSTEAD OF AXIOS.BOTH WORKS SAME***

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const res = await fetch('/api/products');
  //     const data = await res.json();
  //     setProducts(data);
  //   };
  //   fetchProducts();
  // }, []);

  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger' error={error}>
          {error}
        </Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
