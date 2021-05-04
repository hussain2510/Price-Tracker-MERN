import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import "./landing.css"
import {useLocation,useHistory} from 'react-router-dom'; //use history for redirecting to different route and use History for accessing the body of history
import {Redirect,Link} from 'react-router-dom';
import {Button,} from '@material-ui/core';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import IconButton from '@material-ui/core/IconButton';
import Product from './product'
function Landing(){
  // console.log(props);
  
  console.log("hello")
  const location=useLocation();
  const history=useHistory();
  console.log(location)
  const [items,setItem]=useState([])
  if(location.state===undefined && localStorage.getItem("state")==null)
                  {
                      
                      history.push("/")
                  }
                 else if(location.state===true) {if(location.userId)
                  {
                    localStorage.setItem("userId",location.userId);
                    localStorage.setItem("state",location.state);
                  }}
                  const [product,setProduct]=useState({
                    url:'',
                    targetPrice:'',
                    userId:localStorage.getItem("userId")
                });console.log(location.userId);
    useEffect(()=>{
                  console.log(location.state)
                  
                  
      fetch('/api/getAllProduct', {
            method: 'POST',
            body: JSON.stringify({userId:localStorage.getItem("userId")}),
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res =>{
            console.log("res")
            return res.json()})
        .then((data) => {
            console.log(data);
            if(data.success==true)
            {
                //  console.log("sads"+data);
              //   history.push({
              //     pathname:'/landing',
              //   //   search:'?query=abc',
              //     state:data.success,
              //     userId:data.userId
              // });
              setItem(data.items);
            }
          })
          .catch((error) => {
            console.log('error: ' + error);
          });
    },[items])
    function handleChange(e)
    {
        const {name,value}=e.target;    //destructing e.target
         setProduct(prevUser=>{
           return{...prevUser,
            [name]:value}
        });
    }
    function handleClick(e){
      localStorage.clear();
      history.push("/");
    }
    async function handleSubmit(e){
        e.preventDefault();     //for preveting the default action on form submission
        await fetch('/api/addProduct', {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res =>{
            console.log("res")
            return res.json()})
        .then((data) => {
            console.log(data);
            if(data.success==true)
            {
                 console.log(data);
                history.push({
                  pathname:'/landing',
                //   search:'?query=abc',
                  state:data.success,
                  userId:data.userId
              });
            }
          })
          .catch((error) => {
            console.log('error: ' + error);
          });
    }
    return(
        <div className="landing">
           
            <form onSubmit={handleSubmit}>
                <label for="Search" class="forms-label form-label">URL</label>
                
                <input type="text" class="form-url form-control"  style={{width:"600px"}} id="Search" onChange={handleChange} name="url" value={product.url}/>
                <label for="targetPrice" class="forms-label" >Target Price</label>
                <input type="text" class="form-price form-control" id="targetPrice" onChange={handleChange} name="targetPrice" value={product.targetPrice}/>
                <IconButton type="submit" color="primary" aria-label="add to shopping cart">
  <AddShoppingCartIcon />
</IconButton>
 <Button  variant="outlined" className="logout-button" color="primary" size="medium" onClick={handleClick} style={{borderRadius:"4px"}}>
    Logout
    </Button>
        </form>
           <div class="items-render">
            
        {items.map((Item, index) => {
        return (
          <Product
            userId={Item.users[0]}
            key={Item._id}
            id={Item._id}
            name={Item.name}
            price={Item.price}
            targetPrice={Item.targetPrice}
            link={Item.link}
          />
        )
      })}
      </div>
        </div>
        )
}
export default Landing;