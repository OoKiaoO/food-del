/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";
// by setting and exporting the context provider, we make the contextValue variable accessible throughout all components
// in this case we used it to make the food_listarray accessible throughout al components to display food choices
export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

  const [cartItems, setCartItems] = useState({});

// addToCart logic will check if the item id is already present inside the cartItems state, if not is going to add it
  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({...prev, [itemId]: 1}))
    } else {
      setCartItems((prev) => ({...prev, [itemId]: prev[itemId] + 1}))
    }
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({...prev, [itemId]: prev[itemId] - 1}))
  }

  // will collect the info relative to cartItems & display them in the console
  useEffect(() => {
    console.log(cartItems);
  }, [cartItems])

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart
  }
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider