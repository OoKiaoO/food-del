// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios";

// eslint-disable-next-line react/prop-types
const LoginPopup = ({setShowLogin}) => {

  // accessing url through contextValue
  const { url, setToken } = useContext(StoreContext);

  const [currentState, setCurrentState] = useState("Sign Up")
  // creating new state var where to save user info
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  // creating onChange handler to get data from input field & save into state var
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]: value}))
  }

  const onLogin = async (event) => {
    event.preventDefault();
    // setting up backend api call
    // create copy of url
    let newUrl = url;
    // checking if current state is login & adjust api endpoint url accordingly
    if (currentState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }
    // calling api w/ axios with post method (same as server setup file)
    const response = await axios.post(newUrl, data);
    // checking if res is success need to save token in state var inside context
    if (response.data.success) {
      setToken(response.data.token);
      // saving token in the local storage
      localStorage.setItem("token", response.data.token);
      // after succesfully logging in we hide login page w/ setShowLogin func
      setShowLogin(false);
    } else {
      alert(response.data.message);
    }
  }

  // running useEff. to check that the onChange handler works correctly
  // adding data in the final array so that whenever the data changes the useEffect func will be run
  // useEffect(() => {
  //   console.log(data);
  // },[data])

  return (
    <div className='login-popup'>
      <form  onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt='' />
        </div>

        <div className="login-popup-inputs">
          { currentState === "Login" ? <></> : <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder='Your Name' required />}
          <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Your Email' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type='password' placeholder='Password' required />
        </div>

        <button type='submit'>{ currentState === "Sign Up" ? "Create account" : "Login"}</button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {
        currentState === "Login"
          ? <p>Create a new account? <span onClick={() => setCurrentState("Sign Up")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrentState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
