// Importing the configureStore function from Redux Toolkit.
// This utility simplifies creating a Redux store with good defaults.
import { configureStore } from "@reduxjs/toolkit";

// Importing the reducer from the cart slice created in Cart.js
import cartReducer from './Cart';

// Creating the Redux store and configuring it with the reducer(s)
export const store = configureStore({
  // The reducer object defines the state slices and their associated reducers
  reducer: {
    // Assign the "cart" slice of the state to be handled by cartReducer
    cart: cartReducer,
  }
});