const puppeteer = require('puppeteer');
const cron=require('node-cron');
const nodemailer=require("nodemailer");
require('dotenv').config();
const SingleItem=require("../models/singleItemModel");
const User=require("../models/userModel");
const sgMail=require("@sendgrid/mail");
sgMail.setApiKey(process.env.ADMIN_EMAIL_API_KEY);
const Items=require("../models/itemsModel");
var arguments=process.argv;
    module.exports.deleteItem=(req,res)=>{
        let itemId=req.body.itemId;
        let user_Id=req.body.userId;
        SingleItem.findByIdAndDelete(itemId,function(err,result){
            console.log("delete-item");
                 if(err)
                {
                    res.send({
                        msg:'user or items not found',
                        success:false
                    })
                }
                res.status(201).json({
                success:true,
                userId:user_Id
            })
        })
    }
    module.exports.get_singleUser_items=async(req,res)=>{
        let user_Id=req.body.userId;
        SingleItem.find({users:{$all:[user_Id]}},function(err,items){
                if(err)
                {
                    res.send({
                        msg:'user or items not found',
                        success:false
                    })
                }
                res.status(201).json({
                    success:true,
                    title:'items',
                    items:items,
                    userId:user_Id
                })     
        })
    }
    module.exports.add_item=async(req,res)=>{
        let url=req.body.url;
        let target_price=req.body.targetPrice;
        let user_id=req.body.userId;
        console.log(req.body);

        await startTracking(url).then(result => {
            console.log(result)
            if(result){
                if(result.priceInt<=target_price)
                {
                    User.findById(user_id,function(err,user){
                        let newObj={
                            title:result.name,
                            price:result.priceInt,
                            link:url,
                            email:user.email
                        }
                        sendNotification(newObj);

                    })
                   
                }
                console.log("stage1");
            const newItem=new SingleItem({
                name:result.name,
                link:url,
                targetPrice:target_price,
                users:user_id,
                price:result.priceInt
            });
            newItem.save((err,result)=>{
                console.log("satge2");
                
                if(err)
                {
                    console.log(err);
                }
                console.log("item added successfully");
                let newCollection=new Items({
                    uid:result._id,
                });
                newCollection.save((err,result)=>{
                    console.log("satge3");
                    if(err)
                    {
                        console.log(err);
                    }
                    console.log("item is added to item collection");
                     return res.status(201).json({
                        success:true,
                        title:'Product',
                        userId:user_id
                    })
                    })
            });
        }
        });
    }
    

    async function configureBrowser(url){
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    // await page.goto(url);
    //  await page.waitFor('.bot-list-section')
    await page.goto(url, { waitUntil: 'load', timeout: 0 });
    return {page,browser};
}

   // this is selecting one product at a time
    async function checkPrice(page){
        let resultFromPage=await page.evaluate(()=>{
        let name=document.querySelector('#productTitle').innerText;
        let priceStr=document.querySelector('#priceblock_ourprice').innerText;
        let priceInt =parseInt(priceStr.replace(/₹/,'').replaceAll(',',''));
        return{name,priceInt}; 

       
    });
        // console.log(result);
        // price=100;
        // if(price<300)
        // {
        //     console.log("price is dropped");
        //     // sendNotification(price);
        // }
        return resultFromPage;
    }
    

    //use of cron
    async function startTracking(url){
        let pageBrowser=await configureBrowser(url);
        let page=pageBrowser.page;
        // let job=new CronJob('*/30 * * * * *',function(){
            let resultForDatabase=await checkPrice(page);
        // },null,true,null,null,true);
        // job.start();
        console.log(resultForDatabase);
        
        await pageBrowser.browser.close();
        return resultForDatabase;
    }
    


    cron.schedule('0 */12 * * *',()=>{
        SingleItem.find({},(err,items)=>{
            if(err)
            {
                console.log(err);
            }
            items.forEach(e=>{
                console.log("updating");
                cron_update_items(e._id,e.targetPrice);
            })
        })
    })
    let cron_update_items=async(id,targetPrice)=>{
        let itemId=id;
        await SingleItem.findById(itemId,function(err,item){
            console.log(item.users[0]);
            let userId=item.users[0];
            startTracking(item.link)
            .then(data=>{
                if(data){
                    SingleItem.findOneAndUpdate({_id:item._id},{price:data.priceInt},function(err,result){
                        console.log("price updated");
                        console.log(result);
                        if(err)
                        {
                            console.log(err)
                        }
                        User.findById(userId,function(err,user){
                            console.log(user.email)
                            let newObj={
                                title:data.name,
                                price:data.priceInt,
                                link:item.link,
                                email:user.email
        
                            }
                            console.log("current "+newObj.price);
                            if(newObj.price<=targetPrice)
                            {
                                sendNotification(newObj)
                            }
                        })
                    })
                }
            })
            .catch(e=>{
                return {
                    success:false,
                    message:'Major error'
                }
            })
        })
    }


    //for notification
    async function sendNotification(newObj){
        // var transporter=nodemailer.createTransport({
        //     service:'gmail',
        //     auth:{
        //         user:'broforfunofficial@gmail.com',
        //         pass:process.env.Email_Password

        //     }
        // });
        let textToSend='Price dropped to ' + newObj.price;
        let htmlText=`<h1>Thanks For Hoping With Us.Finally Price is Dropped</h1><br></br>
        <h2>now its your time go and buy the product link below</h2><br></br>
        <a href=\"${newObj.link}\">Link</a>`;
        let info={
            from:'broforfunofficial@gmail.com',
            to:""+newObj.email,
            subject:'Price dropped to '+newObj.price,
            text:textToSend,
            html:htmlText
        };
        // console.log("Message send: %s",info.messageId);
        sgMail.send(info).then(res=>{console.log(res)}).catch(err => {
            console.log(err);
          });
        
    }

