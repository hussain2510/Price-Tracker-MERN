import React from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from  '@material-ui/core';
import './product.css'
function Product(props){
    const history=useHistory();
    function handleClick(){
        fetch('/api/deleteProduct', {
            method: 'POST',
            body: JSON.stringify({itemId:props.id,userId:props.userId}),
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
    return (<>
        <div className="Items-heading">
            <p className="item-heading forms-label form-label">{props.name.slice(0,30)}</p><br></br>
            <h2 className="price-item forms-label form-label" style={{color:"black"}}>Current Price:</h2>
            <p className="item-price ">{props.price}</p>
            <h2 className="price-item forms-label form-label" style={{color:"black"}}>TargetPrice:</h2>
            <p className="item-target-price">{props.targetPrice}</p><br></br>
            <Button  variant="contained" className="view-button" color="secondary" size="small"  style={{borderRadius:"4px"}}>
            <a href={props.link} style={{textDecoration:"none",color:"white"}} >View Product</a>
    </Button>
    <Button  variant="contained" className="delete-button" color="secondary" size="small" onClick={handleClick} style={{borderRadius:"4px",marginLeft:"2px"}}>
            Delete
    </Button>
        </div>
    </>)
}
export default Product;