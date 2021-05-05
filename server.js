const express=require("express");
require('dotenv').config();
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const cors = require('cors');
const app=express();
const path = require('path');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const url=process.env.MONGODB_URL
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

const userRoutes=require('./api/routes/userRoutes');
userRoutes(app);

const scrapeRoutes=require('./api/routes/scrapeRoutes');
scrapeRoutes(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cors Controls-to communicate react server to this server
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.use(cors());

if(process.env.NODE_ENV === 'production')
{
  app.use(express.static("client/build"));
  app.get('*',(req,res)=>{                    //if any request that is made to derver is not api like /create or/loginUser then we will send a html file that will prevent /get cannot find
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}
////path.join will concatenate __dirname which is the directory name of the current file concatenated with values of some and dir with platform-specific separator.
// we can concatenate using + or use join
// app.get("/",function(req,res){
//     console.log("home page")
// })

app.listen(process.env.PORT || 4000,function(){
    console.log("server listening at 4000")
})