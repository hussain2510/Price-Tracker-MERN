import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from "react";
import {useHistory} from 'react-router-dom'
import { Button } from '@material-ui/core';
import './register.css'
function Register(){
    const history=useHistory();
    const [user,SetUser]=useState({
        name:"",
        email:"",
        password:""
    })
    function handleChange(e){
        const {value,name}=e.target;   //e target is used for targetting a aprticular input filed
        SetUser(prevUser=>{
           return{...prevUser,
            [name]:value}
        });
    }
    async function handleSubmit(e){
        e.preventDefault();
       await fetch('/api/user/create', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res =>{
            return res.json()})
        .then((data) => {
            console.log(data.obj._id);
            console.log(data.success);
            if(data.success==true)
            {
                 console.log(data);
                 history.push({
                  pathname:'/landing',
                //   search:'?query=abc',
                  state:data.success,
                  userId:data.obj._id
              });
            }
          })
          .catch((error) => {
            console.log('error: ' + error);
          });
        //   console.log(userCreate)
        //   if(userCreate)
        //   {
             
        //   }
    }
    return(
    <div className="register">
    <form onSubmit={handleSubmit} >
         <div class="mb-3">
            <label  class="form-label" class="forms-label">Username</label><br></br>
            <input type="text"  class="form-control"  id="exampleInputName" onChange={handleChange} name="name" value={user.name}/>
        </div>
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label" class="forms-label">Email address</label><br></br>
            <input type="email" class="form-control" id="exampleInputEmail1" onChange={handleChange} name="email" value={user.email}/>
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label" class="forms-label">Password</label><br></br>
            <input type="password" class="form-control" id="exampleInputPassword1" onChange={handleChange} name="password" value={user.password}/>
        </div>
        <Button type="submit" variant="outlined" className="login-button1" color="primary" size="medium">
    Register
    </Button>
    </form>
    </div>
    )
}
export default Register;