import React, { useEffect, useState } from 'react';
import { Products } from '../components/Products';
import { useDispatch } from 'react-redux';

// Import the Redux action to change quantity in the cart
import { changeQuantity } from '../stores/Cart';

// Define the CartItem component, which receives props for a single cart item
const CartItem = (props) => {
  // Destructure productId and quantity from the passed-in cart data
  const { productId, quantity } = props.data;

  // Local state to store the full details of the product (e.g. name, gif, etc.)
  const [detail, setDetail] = useState([]);

  // Redux dispatch function
  const dispatch = useDispatch();

  // When the component mounts or productId changes,
  // find and set the product details using the productId from cart
  useEffect(() => {
    const findDetail = Products.filter(product => product.id === productId)[0];
    setDetail(findDetail);
  }, [productId]);

  // Function to handle decreasing the quantity in the cart
  const handleMinusQuantity = () => {
    dispatch(changeQuantity({
      productId: productId,
      quantity: quantity - 1, // Reduce quantity by 1
    }));
  };

  // Function to handle increasing the quantity in the cart
  const handlePlusQuantity = () => {
    dispatch(changeQuantity({
      productId: productId,
      quantity: quantity + 1, // Increase quantity by 1
    }));
  };

  return (
    <div className="cartitemListStyle">
      {/* Display the exercise GIF for this cart item */}
      <img src={detail.gif} alt="" className="cartitemListStyle" />


      <div className="buttonsPrevAndNextStyle">

      </div>
    </div>
  );
};

export default CartItem;