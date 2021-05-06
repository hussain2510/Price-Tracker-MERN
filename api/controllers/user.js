'use strict';
const mongoose=require("mongoose");
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User=require("../models/userModel");
const _ = require('lodash');
const nodemailer=require("nodemailer");
let config = require('../../middlewares/config');
const sgMail=require("@sendgrid/mail");
sgMail.setApiKey(process.env.ADMIN_EMAIL_API_KEY);
let imageLocation= "../../webimage.png";
exports.login = (req, res) => {

  let data=req.body;
    User.findOne({email:data.email},function(err,user){
    if(err)
    {
      return res.status(500).json({
        succes:false,
        title:'An error occured',
        err:err
      })
    }
    if(!user)
    {
      console.log("user not found");
      return res.status(401).json({
        success:false,
        title:'Login failed',
        error:{
          message:'invalid login credentials'
        }
      })
    }
    else if(user)
    { 
    if(!bcrypt.compareSync(data.password,user.password))
    {console.log("user found but password do not match");
      return res.status(401).json({
        success:false,
        title:'wrong password',
        error:{
          message:'password does not match'
        }
      })
    }
    if(bcrypt.compareSync(data.password,user.password))
    {
      console.log("password matched")
      let userFiltered = _.pick(user.toObject(), [
      'name',
      'email',
      'created_date',
      '_id',
      'status'
    ]);
    
     return res.status(201).json({
        success:true,
        title:'Login Successful',
        obj:userFiltered
      })
    }

    }
  })
}

async function sendNotification(details){
  console.log("send mail");
  // var transporter=nodemailer.createTransport({
  //     service:'gmail',
  //     auth:{
  //         user:'broforfunofficial',
  //         pass:process.env.Email_Password

  //     }
  // });
  let textToSend=JSON.stringify(details);
  let htmlText=`<h2>Thanks for registering with us.You are just one step away from purchasing product in your budget</h2><br></br>
  <h2>Step2:Copy your Product Link From Amazon,Set a target Price then Add it.</h2><br></br>
  <h3>As soon as your Product reaches your target price we will notify you</h3><br></br>
  <h4>Founder:</h4>
  <h6>Hussain Ahmad</h6>
  `;  //``for multiline string
  let info={
      from:'broforfunofficial@gmail.com',
      to:""+details.email,
      subject:'Successfully registered',
      text:textToSend,
      html:htmlText,
      // attachments: [
    //     {   // utf-8 string as an attachment
    //     filename: 'text1.txt',
    //     content: 'hello world!'
    // },
    // {   // binary buffer as an attachment
    //     filename: 'text2.txt',
    //     content: new Buffer('hello world!','utf-8')
    // },
    // {   // file on disk as an attachment
    //     filename: 'website.png',
    //     path:__dirname+'../../../webimage.png', // stream this file  //dirname to track the current path
    //     cid:"website"
    // }
    // },
    // {   // filename and content type is derived from path
    //     path: '/webimage.png'
    // }
    // {   // stream as an attachment
    //     filename: 'text4.txt',
    //     content: fs.createReadStream('file.txt')
    // },
    // {   // define custom content type for the attachment
    //     filename: 'text.bin',
    //     content: 'hello world!',
    //     contentType: 'text/plain'
    // },
    // {   // use URL as an attachment
    //     filename: 'license.txt',
    //     path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
    // },
    // {   // encoded string as an attachment
    //     filename: 'text1.txt',
    //     content: 'aGVsbG8gd29ybGQh',
    //     encoding: 'base64'
    // },
    // {   // data uri as an attachment
    //     path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
    // }
// ]
  };
  sgMail.send(info).then(res=>{console.log(res)}).catch(err => {
    console.log(err);
  });
  // console.log("Message send: %s",info.messageId); 
}
exports.create_a_user = (req, res) => {
  console.log("fromclient");
  if(req.body.name && req.body.email && req.body.password)
  { 
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  });
  newUser.save(async(err,user)=>{
    if (err) {
      res.send({
        error: err,
        message: "Couldn't create new user", 
        code: 400
      });
    }
    if(user)
    {
    let userFiltered = _.pick(user.toObject(), [
      'name',
      'email',
      'created_date',
      '_id',
      'status'
    ]);
    sendNotification(userFiltered);
    res.status(201).json({
      message: 'User created',
      success: true,
      obj: userFiltered
    });
    // or
    // res.send(userFiltered)
  }

});
  }
  else
  {
  res.status(500).json({
    succes:false,
    title:'An error occured',
  })
}
};

