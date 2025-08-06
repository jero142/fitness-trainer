import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../components/CartItem';
import { TiArrowSortedDown } from "react-icons/ti";
import chrono from '/images/chronometer.png';
import reps from '/images/9-close-hands-push-ups.png';
import { updateItemSetting } from '../stores/Cart';
import { Link } from 'react-router-dom';
import TimerInput from '../components/TimerInput';
import RepsInput from '../components/RepsInput';

const CartTab = () => {
  // Accessing the cart items from the Redux store
  const carts = useSelector(store => store.cart.items);

  // Hook to dispatch actions to the Redux store
  const dispatch = useDispatch();

  // Pagination settings: one item per page
  const itemsPerPage = 1;
  const totalPages = Math.ceil(carts.length / itemsPerPage);

  // State for the current page in pagination
  const [currentPage, setCurrentPage] = useState(1);

  // State to check if all cart items are valid (have either timer or reps)
  const [isCartValid, setIsCartValid] = useState(false);

  // Function to go to the next page, up to the last page
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Function to go to the previous page, down to the first page
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Determine the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = carts.slice(startIndex, startIndex + itemsPerPage);

  // Get the current item (only one per page)
  const currentItem = paginatedItems.length > 0 ? paginatedItems[0] : null;

  // Handler for when the timer input changes
  const handleTimerChange = (e, productId) => {
    const value = Number(e.target.value);
    dispatch(updateItemSetting({ productId, settingType: 'timer', value }));
  };

  // Handler for when the reps input changes
  const handleRepsChange = (e, productId) => {
    const value = Number(e.target.value);
    dispatch(updateItemSetting({ productId, settingType: 'reps', value }));
  };

  // If the total number of pages changes and the current page becomes invalid, reset it
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Check if all exercises have either timer or reps set to 1 or more
  useEffect(() => {
    const valid = carts.every(
      (item) => Number(item.timer) >= 1 || Number(item.reps) >= 1
    );
    setIsCartValid(valid);
  }, [carts]);

  return (
    <div className="setexercises-container">
      
      {/* Pagination and cart item viewer */}
      <div className="cartTabStyle">
        <div className="carttabexercises-container">
          
          {/* Button to go to previous item */}
          <div className="buttoncartleft">
            <button className="fromPage2toPage1" onClick={goToPreviousPage} disabled={currentPage === 1}>
              <TiArrowSortedDown />
            </button>
          </div>

          {/* Display the current item's name and its cart data */}
          <div className="exercise-column">
            {currentItem && (
              <h2 className="exercise-title">{currentItem.name}</h2>
            )}
            <div className="cartsListItemDisplayStyle">
              {paginatedItems.map((item, key) => (
                <CartItem key={key} data={item} />
              ))}
            </div>
          </div>

          {/* Button to go to next item */}
          <div className="buttoncartright">
            <button className="fromPage1toPage2" onClick={goToNextPage} disabled={currentPage === totalPages}>
              <TiArrowSortedDown />
            </button>
          </div>
        </div>

        {/* Page indicator */}
        <div className="page-info-container">
          <p className="page-info-style">Page {currentPage} / {totalPages}</p>
        </div>
      </div>

      {/* Settings for timer and reps */}
      <div className="chronovsreps-container">
        <div className="chrono-reps-forms-container">

          {/* Timer input with icon */}
          <div className="timer-container">
            <img src={chrono} alt="chrono-image" className="chrono" />
            <div className="form-timer-submit">
              <form onSubmit={(e) => e.preventDefault()}>
                <TimerInput
                  currentItem={currentItem}
                  timerValue={currentItem?.timer || ''}
                  repsValue={currentItem?.reps || ''}
                  onTimerChange={handleTimerChange}
                />
              </form>
            </div>
          </div>

          {/* Separator between timer and reps */}
          <div className="or-container"><span></span></div>

          {/* Reps input with icon */}
          <div className="reps-container">
            <img src={reps} alt="reps-image" className="reps" />
            <div className="form-reps-submit">
              <form onSubmit={(e) => e.preventDefault()}>
                <RepsInput
                  currentItem={currentItem}
                  repsValue={currentItem?.reps || ''}
                  timerValue={currentItem?.timer || ''}
                  onRepsChange={handleRepsChange}
                />
              </form>
            </div>
          </div>
        </div>

        {/* Display warning or button based on input validity */}
        <div className="warning-text-container">
          {isCartValid ? (
            <Link to="/workout" className="nav-button">Now Workout!</Link>
          ) : (
            <p className="warning-text">Set timer or reps ≥ 1 for all exercises</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartTab;