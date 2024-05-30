/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
// by setting and exporting the context provider, we make the contextValue variable accessible throughout all components
// in this case we used it to make the food_listarray accessible throughout al components to display food choices
export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

  const [cartItems, setCartItems] = useState({});
  // adding url into contextValue so it is accessible throughout the app
  const url = "https://nameless-reef-81910-873bf73b9bcf.herokuapp.com";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

// addToCart logic will check if the item id is already present inside the cartItems state, if not is going to add it
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({...prev, [itemId]: 1}))
    } else {
      setCartItems((prev) => ({...prev, [itemId]: prev[itemId] + 1}))
    }
    // if user logged in & adds item to cart, this info will be stored in db
    if (token) {
      await axios.post(url + "/api/cart/add", {itemId}, {headers: {token}})
    }
  }

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({...prev, [itemId]: prev[itemId] - 1}))
    if (token) {
      await axios.post(url + "/api/cart/remove", {itemId}, {headers: {token}});
    }
  }

  // will collect the info relative to cartItems & display them in the console
  // useEffect(() => {
  //   console.log(cartItems);
  // }, [cartItems])

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for(const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  }

  // fetching food data stored in db
  const fetchFoodList = async () => {
    // calling backend api thru axios with get method (cause that is the method we setup in foodRoute file)
    const response = await axios.get(url + "/api/food/list");
    console.log('API response', response.data.data);
    // saving data received from api into state var
    setFoodList(response.data.data);
  }

  const loadCartData = async (token) => {
    const response = await axios.post(url + "/api/cart/get", {}, {headers: {token}});
    setCartItems(response.data.cartData);
  }

  // using useEff. hook to prevent user token to be lost on page refresh when logged in
  // useEff hook gets called on every page reload
  // running fetchFoodLIst func whenever page is loaded (since it's an async function, wrapping into another async func to make sure it is resolved before page gets loaded)
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      // check if token present in localStorage
      if (localStorage.getItem("token")) {
      // if present we store it in the token state var
        setToken(localStorage.getItem("token"));
        // running func to presist user cart data on page refresh
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  },[])

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  }
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider
