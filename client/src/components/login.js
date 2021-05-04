import React from 'react';
import {useHistory} from 'react-router-dom';
import {useState} from 'react';
import { Button } from '@material-ui/core';
import './login.css'
function Login(){
    const [user,SetUser]=useState({
        email:'',
        password:''
    })
    const history=useHistory();
    async function handleSubmit(e){
        console.log("hello")
          e.preventDefault();
         await fetch('/api/user/loginUser', {
            method: 'POST',
            body: JSON.stringify(user),
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
                 console.log(data.obj._id);
                 history.push({
                  pathname:'/landing',
                //   search:'?query=abc',
                  state:data.success,
                  userId:data.obj._id
              });
            }
            else if(data.success==false)
            {
                console.log(data.title);
                if(data.title="Login failed")
                {
                        history.push("/register");
                }
               else if(data.title="wrong password")
                {
                    alert(data.title);
                }
                
            }
          })
          .catch((error) => {
            console.log('error: ' + error);
          });
    }
    function handleChange(e){
        const {value,name}=e.target;
         SetUser(prevUser=>{
           return{...prevUser,
            [name]:value}
        });
    }
    return(
        <div className="login">
        <form onSubmit={handleSubmit}>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="forms-label" >Email address</label><br></br>
                <input type="email" class="form-control" id="exampleInputEmail1" onChange={handleChange} name="email" value={user.email}/><br></br>
                
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="forms-label" >Password</label><br></br>
                <input type="password" class="form-control" id="exampleInputPassword1" onChange={handleChange} name="password" value={user.password}/>
            </div>
            <Button type="submit" variant="outlined" color="primary" size="medium" className="login-button2" color="primary" >
    Login
    </Button>
        </form>
        </div>
        )
}
export default Login;