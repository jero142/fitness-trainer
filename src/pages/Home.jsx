import React, { useEffect, useState } from 'react';
import postit from '/images/postit.png';
import { Products } from '../components/Products';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../stores/Cart';
import { Link } from 'react-router-dom';
import { TiArrowSortedDown } from "react-icons/ti";


const Home = () => {
  // State to track hovered product name
  const [hoveredName, setHoveredName] = useState('');

  // State to track total number of selected exercises
  const [totalQuantity, setTotalQuantity] = useState(0);

  // Selecting cart items from Redux store
  const carts = useSelector(store => store.cart.items);

  // Getting the dispatch function from Redux
  const dispatch = useDispatch();

  // State to track which product is being hovered
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // When hovering over a product, set the hovered product and its name
  const handleMouseEnter = (productId) => {
    setHoveredProduct(productId);
    const product = Products.find((p) => p.id === productId);
    setHoveredName(product?.name || '');
  };

  // Clear hovered product info on mouse leave
  const handleMouseLeave = () => {
    setHoveredProduct(null);
    setHoveredName('');
  };

  // Handle adding or removing a product from the cart
  const handleAddToCart = (product) => {
    const isAlreadyInCart = carts.some(item => item.productId === product.id);

    // Show +1 or -1 indicator depending on action
    setFloatingIndicator({
      id: product.id,
      value: isAlreadyInCart ? '-1' : '+1',
      key: Date.now(), // unique key for animation
    });

    // Dispatch appropriate Redux action
    if (isAlreadyInCart) {
      dispatch(removeFromCart({ productId: product.id }));
    } else {
      dispatch(addToCart({ product }));
    }
  };

  // State for filtering exercises
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Pagination configuration
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered product list based on selected muscle groups
  const filteredProducts = selectedFilters.length === 0
    ? Products
    : Products.filter(product =>
        product.muscleGroups.some(group => selectedFilters.includes(group))
      );

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Determine which products to show on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = Products.slice(startIndex, startIndex + itemsPerPage);

  // Go to previous page
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Go to next page
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // List of all muscle groups
  const MUSCLE_GROUPS = ["BACK", "LEGS", "SHOULDERS", "CHEST", "ARMS", "ABDOMINALS"];

  // State for floating +1/-1 indicator
  const [floatingIndicator, setFloatingIndicator] = useState(null);

  // Update total quantity in post-it every time cart changes
  useEffect(() => {
    let total = 0;
    carts.forEach(item => total += item.quantity);
    setTotalQuantity(total);
  }, [carts]);

  // Reset to page 1 if filtered results no longer cover current page
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredProducts, totalPages]);

  // Render
  return (
    <div className="programm-container">
      <div className="exercises-container">
        <div className="exercises-card-container">

          {/* Display GIF when hovering over a product */}
          <div className="card-exercises-screen">
            {hoveredProduct && (
              <img
                src={Products.find((product) => product.id === hoveredProduct).gif}
                className='gifScreen'
                alt="Exercise GIF"
              />
            )}
            <div className="select-exercise-overlay">
              <p className="select-text">Select your exercises</p>
              <div className="arrow-indicator">⬇</div>
            </div>
          </div>

          {/* List of exercise buttons */}
          <div className="productsStyle">
            {filteredProducts
              .slice(startIndex, startIndex + itemsPerPage)
              .map((product) => (
                <button
                  key={product.id}
                  onMouseEnter={() => handleMouseEnter(product.id)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleAddToCart(product)}
                  className={`buttonproductcartstyle ${
                    carts.some(item => item.productId === product.id) ? 'selected' : ''
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className='imageproductcartstyle'
                  />
                </button>
              ))}
          </div>

          {/* Pagination and clear cart */}
          <div className="paginationproductcart">
            <div></div>
            <div className="buttonproductcartleftcontainer">
              <button className="buttonproductcartleft"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <TiArrowSortedDown />
              </button>
            </div>

            <p className="page-info-home">Page {currentPage} / {totalPages}</p>

            <div className="buttonproductcartrightcontainer">
              <button className="buttonproductcartright"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <TiArrowSortedDown />
              </button>
            </div>

            {/* Clear cart button if cart not empty */}
            <div className="clear-cart-button-container">
              {carts.length > 0 && (
                <button
                  className="clear-cart-button"
                  onClick={() => dispatch(clearCart())}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Post-it display with total and floating indicator */}
        <div className="postit-container">
          <div className="postitCartStyle">
            <img src={postit} alt="" />
            <span className="postit-total-selected"> Total</span>
            <span className="postitSpanstyle">{totalQuantity}</span>
            {floatingIndicator && (
              <span
                key={floatingIndicator.key}
                className={`floating-indicator-postit ${
                  floatingIndicator.value === '+1' ? 'plus' : 'minus'
                }`}
              >
                {floatingIndicator.value}
              </span>
            )}
          </div>

          {/* Muscle group filter buttons */}
          <div className="filter-container">
            {MUSCLE_GROUPS.map(group => (
              <button
                key={group}
                onClick={() =>
                  setSelectedFilters(prev =>
                    prev.includes(group)
                      ? prev.filter(g => g !== group)
                      : [...prev, group]
                  )
                }
                className={`filter-button ${selectedFilters.includes(group) ? 'active' : ''}`}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Clear filters button */}
          {selectedFilters.length > 0 && (
            <div className="clear-filters">
              <button className="clear-filters-button" onClick={() => setSelectedFilters([])}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Diagram panel on the right */}
      <div className="diagram-container">
        <div className="sticker-diagramm">
          <img id='image-sticker' src="images/sticker.png" alt="sticker-muscles" />
          <div className="name-exercise-sticker">
            {hoveredName && <h3 className="typewriter">{hoveredName}</h3>}
          </div>
        </div>

        {/* Muscle anatomy overlays */}
        <div className="anatomy-container">
          {hoveredProduct && (
            <img
              src={Products.find((product) => product.id === hoveredProduct).primary}
              className='exercise-primary-muscles'
              alt="exercse-primary-mucles"
            />
          )}
          {hoveredProduct && (
            <img
              src={Products.find((product) => product.id === hoveredProduct).secondary}
              className='exercise-secondary-muscles'
              alt="exercse-secondary-mucles"
            />
          )}
          {hoveredProduct && (
            <img
              src={Products.find((product) => product.id === hoveredProduct).names}
              className='exercise-names'
              alt="exercise-names"
            />
          )}
          <img
            id='image-muscles'
            src="images/muscle-anatomy.png"
            alt="muscle-anatomy"
          />
        </div>

        {/* Set exercises button (only clickable when cart is not empty) */}
        <div className="set-exercises-button-container">
          <Link
            to={carts.length > 0 ? "/:slug" : "#"}
            className={(nav) => (nav.isActive ? "nav-active" : "")}
            onClick={(e) => {
              if (carts.length === 0) e.preventDefault();
            }}
          >
            <button disabled={carts.length === 0} className="set-exercises-button">
              <h3>SET EXERCISES</h3>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};


export default Home;