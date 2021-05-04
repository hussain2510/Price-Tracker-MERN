import React from 'react';
import Steps from './steps';
import  {Link} from 'react-router-dom';
import {useHistory} from 'react-router-dom'
import { Button } from '@material-ui/core';
import './home.css';
function Home(){
    const history=useHistory();
    return(
    <>
    <div className="home-heading">
    <div className="button-heading">
    <Button onClick={()=>{history.push("/login")}} variant="outlined" className="login-button" color="primary" style={{width:"250px",height:"50px"}}>
    LOGIN
    </Button>
    <Button onClick={()=>{history.push("/register")}}  className="register-button" variant="outlined" style={{width:"250px",height:"50px",color:"white",border:"1px solid rgb(255 252 252 / 23%)",marginLeft:"30px" }}>
  Register
</Button>
    </div>
    
    <h1 className="home-heading-title">Want But Not In ? <span className="heading-title-span">Budget</span></h1>
    <p className="home-subheading">most of the time we want to buy a product but that not fits in our budget we provide that solution for you,you just need copy that product link,paste,set the ttarget price you want and then leave all things on us</p>
    <Button className="get-started" variant="contained" onClick={()=>{history.push("/register")}}  style={{width:"250px",height:"50px",backgroundColor:"rgb(4 4 14)",borderRadius:"15px"}} color="primary" >
  Get STarted
</Button>
    </div>
     <Steps />
    </>
    )
}
export default Home;