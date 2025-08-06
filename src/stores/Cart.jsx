import { createSlice } from "@reduxjs/toolkit";

// Initial state of the cart: starts with an empty array of items
const initialState = { 
  items: []
};

// Creating the cart slice
const cartSlice = createSlice({
  name: 'cart', // Name of the slice in the Redux store
  initialState, // Initial state defined above
  reducers: {
    
    // Adds an item to the cart or increases quantity if already in cart
    addToCart(state, action) {
      const { product } = action.payload; // Destructure the product from the payload
      // Check if product already exists in the cart
      const existingIndex = state.items.findIndex(item => item.productId === product.id);
    
      if (existingIndex >= 0) {
        // If it exists, increase its quantity
        state.items[existingIndex].quantity += 1;
      } else {
        // If not, push a new item with initial settings
        state.items.push({
          productId: product.id,
          name: product.name,
          image: product.image,
          gif: product.gif, 
          quantity: 1,
          timer: null, // Timer and reps will be set later
          reps: null
        });
      }
    },

    // Clears all items from the cart
    clearCart(state) {
      state.items = [];
    },

    // Updates either the timer or reps setting of a cart item
    updateItemSetting(state, action) {
      const { productId, settingType, value } = action.payload; // Destructure payload
      const item = state.items.find(item => item.productId === productId); // Find the item
      if (item) {
        item[settingType] = value; // Update either timer or reps

        // Ensure mutual exclusivity: setting one clears the other
        if (settingType === 'timer') item.reps = null;
        if (settingType === 'reps') item.timer = null;
      }
    },

    // Changes quantity of an item; removes it if quantity is 0 or less
    changeQuantity(state, action) {
      const { productId, quantity } = action.payload;
      // Find index of the product
      const indexProductId = state.items.findIndex(item => item.productId === productId);

      if (quantity > 0) {
        // Update quantity if valid
        state.items[indexProductId].quantity = quantity;
      } else {
        // Otherwise, remove the item
        state.items = state.items.filter(item => item.productId !== productId); 
      }
    },

    // Removes a specific item from the cart
    removeFromCart(state, action) {
      const { productId } = action.payload;
      // Filter out the item to remove it
      state.items = state.items.filter(item => item.productId !== productId);
    }
  }
});

// Exporting action creators for use in components
export const {
  addToCart,
  changeQuantity,
  updateItemSetting,
  removeFromCart,
  clearCart
} = cartSlice.actions;


export default cartSlice.reducer;