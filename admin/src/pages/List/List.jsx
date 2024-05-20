// eslint-disable-next-line no-unused-vars
import React from 'react'
import './List.css'
import { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const List = ({url}) => {
  // creating state var to contain db food data
  const [list, setList] = useState([]);

  // function to connect to backend api to request food data
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    // console.log(response.data);
    // check if data has been saved into response
    if (response.data.success) {
      // save data into state var
      setList(response.data.data);
    } else {
      toast.error("Error loading datat from db")
    }
  }

  const removeFood = async (foodId) => {
    // first call backend api & hit the remove path, prividing food id
    const response = await axios.post(`${url}/api/food/remove`, {id: foodId});
    // then call list api again to display new data on page
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error connecting to backend api");
    }
  }

  // when page is loaded we will run fetch func once
  useEffect(() => {
    fetchList();
  },[])

  return (
    <div className='list add flex-col'>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/` + item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                <p className='cursor' onClick={() => removeFood(item._id)} >X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
