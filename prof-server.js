require("dotenv").config();
var express = require("express");   //gives reference of header file
var mysql = require("mysql");
var path = require("path");
var app = express();               // function called and controls is now with app


//---------------SETTING UP NODE MAILER------------------------


// const nodemailer=require("nodemailer")
// const{google}=require("googleapis")

// const clients_ID=process.env.CLIENT_ID;
// const clients_SECRET=process.env.CLIENT_SECRET;
// const REDIRECT_URI="https://developers.google.com/oauthplayground";
// const REFRESH_TOKEN=process.env.REFRESH_TOKEN;
// const oAuth2clients= new google.auth.OAuth2(clients_ID,clients_SECRET,REDIRECT_URI)
// oAuth2clients.setCredentials({refresh_token:REFRESH_TOKEN})

// async function sendMail(){
//     try{
// const accessToken=await oAuth2clients.getAccessToken()
// const transport= nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         type:"OAuth2",
//         user: process.env.GMAIL_USER;
//         clientsId: clients_ID,
//         clientsSecret:clients_SECRET,
//         refreshToken:REFRESH_TOKEN,
//         accessToken: accessToken
//     }
// })

// const mailOptions={
//     from:process.env.GMAIL_USER,
//     to:process.env.GMAIL_RECEIVER,
//     subject:"hey testing my nodemailer",
//     text: "for my web app event manager",
//      html:"<h1>hello from gmail using API</h1>", //optional
// };
// const result=await transport.sendMail(mailOptions)
// return result


//     } catch(error){
//         return error
//     }
// }
// sendMail()
// .then((result)=>console.log("email sent",result))
// .catch((error)=>console.log(error.message));



app.use(express.static("public"));  //to serve .css and .js files to clients behind the scene
app.listen(6003, function () {     //port number is 6003 here
    console.log("server started")
})

app.get("/cprof", (req, resp) => {

    var filePath = path.join(path.resolve(), "public", "profile-client.html");
    resp.sendFile(filePath);

})

app.get("/vprof", (req, resp) => {

    var filePath = path.join(path.resolve(), "public", "profile-vendor.html");
    resp.sendFile(filePath);

})

app.get("/cdash", (req, resp) => {

    var filePath = path.join(path.resolve(), "public", "dash-client.html");
    resp.sendFile(filePath);

})

app.get("/vdash", (req, resp) => {

    var filePath = path.join(path.resolve(), "public", "dash-vendor.html");
    resp.sendFile(filePath);

})

app.get("/home", (req, resp) => {

    var filePath = path.join(path.resolve(), "public", "mypage.html");
    resp.sendFile(filePath);

})

app.get("/admin", (req, resp) => {
    var filePath = path.join(path.resolve(), "public", "dash-admin.html");
    resp.sendFile(filePath);
})

var fileup = require("express-fileupload");             //image is sent in binary format
const { appengine_v1alpha } = require("googleapis");
app.use(fileup());
app.use(express.urlencoded({ extended: true }));        //to convert Binary to JSON Object


//---------------------DATABASE CONNECTIVITY---------------------//


var dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: "",
    database: process.env.DB_DATABASE
}
var dbcon = mysql.createConnection(dbConfig);
dbcon.connect(function (err) {
    if (err)
        console.log(err.message);
    else
        console.log("Connected.. Congrats...");
})


//---------------------------SAVE CLIENT PROFILE---------------------------


app.post("/profile-save", (req, resp) => {

    if (req.files == null)
        req.body.picname = "prof-pic.png";
    else {
        req.body.picname = req.files.ppic.name;
        var uploadsFolder = path.join(path.resolve(), "public", "uploads", req.files.ppic.name);
        //console.log(uploadsFolder);
        //resp.send("File Received:"+req.files.ppic.name);
        req.files.ppic.mv(uploadsFolder);
        //resp.send("Pic saved");
    }

    var curd = new Date();
    var dos = curd.getFullYear() + "-" + (curd.getMonth() + 1) + "-" + curd.getDate();
    var tos = curd.getHours() + ":" + curd.getMinutes() + ":" + curd.getSeconds();

    //console.log(tos);
    req.body.dos = dos;
    req.body.tos = tos;

    // var cities = req.body.city.toString();
    // req.body.city = cities;

    var data = [req.body.uid, req.body.name,req.files.ppic.name, req.body.eid, req.body.addr, req.body.city, req.body.cno, req.body.tos, req.body.dos];
    dbcon.query("insert into clients values(?,?,?,?,?,?,?,?,?)", data, function (err) {
        if (err)
            resp.send(err);
        else
            resp.redirect("success.html");
    })
})


//--------------------SAVE VENDOR PROFILE---------------------------


app.post("/profile-save-vendor", (req, resp) => {

    if (req.files == null)
        req.body.picname = "prof-pic.png";
    else 
    {
        req.body.picname = req.files.ppic.name;
        var uploadsFolder = path.join(path.resolve(), "public", "uploads", req.files.ppic.name);
        //console.log(uploadsFolder);
        //resp.send("File Received:"+req.files.ppic.name);
        req.files.ppic.mv(uploadsFolder);
        //resp.send("Pic saved");
    }

    var curd = new Date();
    var dos = curd.getFullYear() + "-" + (curd.getMonth() + 1) + "-" + curd.getDate();
    var tos = curd.getHours() + ":" + curd.getMinutes() + ":" + curd.getSeconds();

    //console.log(tos);
    req.body.dos = dos;
    req.body.tos = tos;

    // var services = req.body.serve.toString();
    // req.body.serve = services;
    
var data = [req.body.uid, req.body.name, req.body.cno, req.body.firm, req.body.estd, req.body.addr,req.body.city,req.body.aadhar, req.files.ppic.name,req.body.selserve, req.body.tos, req.body.dos];
   console.log(data);
    dbcon.query("insert into vendors values(?,?,?,?,?,?,?,?,?,?,?,?)", data, function (err) {
        if (err)
            resp.send(err);
        else
            resp.redirect("success.html");
    })
})


//-----------------------------------SAVE NEW USERS DATA----------------------------


app.post("/signup-save", (req, resp) => {

    // var curd = new Date();
    // var dos = curd.getFullYear() + "-" + (curd.getMonth() + 1) + "-" + curd.getDate();
    // req.body.dos = dos;

    var data = [req.body.email, req.body.pwd, req.body.type];
    dbcon.query("insert into users values(?,?,?,current_date())", data, function (err) {
        if (err)
            resp.send(err);
        else
            resp.redirect("success.html");
    })
})


//---------------------------------TO IMPLEMENT AJAX AND FETCH CLIENT DATA------------------------------------


app.get("/chk-user-in-table", function (req, resp) {
    // resp.send("Bale Bale of "+ req.query.thisuser);
    dbcon.query("select * from clients where uid=?", [req.query.thisuser], function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result);
    })
})


//--------------------------TO IMPLEMENT AJAX AND FETCH VENDOR DATA---------------------------------------------


app.get("/fetch-data",function(req,resp){
    //resp.send("Bale Bale of "+ req.query.thisuser);

    dbcon.query("select * from vendors where eid=?",[req.query.thisuser],function(err,result){
        if(err)
        resp.send(err.message);
        else
        resp.send(result);
    })
})

app.get("/find-user-in-table", function (req, resp) {
    // resp.send("Bale Bale of "+ req.query.thisuser);

    dbcon.query("select * from users where email=?", [req.query.thisuser], function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result);
    })
})


app.get("/login-table", function (req, resp) {
    // resp.send("Bale Bale of "+ req.query.thisuser);
console.log(req.query.thisuser);
console.log(req.query.pwd);
    dbcon.query("select * from users where email=? and pwd=?", [req.query.thisuser,req.query.pwd], function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send(result);
    })
})


//------------------------UPDATE CLIENT PROFILE--------------------------------


app.post("/profile-update", (req, resp) => {
     //resp.send("updated...")

    var filename = "";
    if (req.files == null) {
        console.log("***************" + req.body.jasoos);
        filename = req.body.jasoos;
    }
    else {
        req.body.picname = req.files.ppic.name;
        var uploadsFolder = path.join(path.resolve(), "public", "uploads", req.files.ppic.name);
        req.files.ppic.mv(uploadsFolder);

        filename = req.files.ppic.name;
        console.log(filename);
    }

    var data = [filename,req.body.name,req.body.eid,req.body.addr,req.body.city,req.body.cno,req.body.uid];
   console.log(data);
    dbcon.query("Update clients Set ppic=?,name=?,eid=?,addr=?,city=?,cno=? WHERE uid=?",data, function (err,res) {
        if (err)
            resp.send(err);
        else
            resp.send(res);
    })
})


//-----------------------------------UPDATE VENDOR PROFILE-------------------------------------


app.post("/profile-update-vendor", (req, resp) => {
    // resp.send("updated...")

    var filename = "";
    if (req.files == null) {
        console.log("***************" + req.body.jasoos);
        filename = req.body.jasoos;
    }
    else {
        req.body.picname = req.files.ppic.name;
        var uploadsFolder = path.join(path.resolve(), "public", "uploads", req.files.ppic.name);
        req.files.ppic.mv(uploadsFolder);

        filename = req.files.ppic.name;
        console.log(filename);
    }

    var data = [filename, req.body.name, req.body.cno, req.body.firm, req.body.estd, req.body.addr,req.body.city,req.body.aadhar,req.body.selserve,req.body.eid];
   console.log(data);
    dbcon.query("UPDATE vendors SET ppic=?,name=?,cno=?,firm=?,estd=?,addr=?,city=?,aadhar=?,serve=? WHERE eid=?",data, function (err,res) {
        if (err)
            resp.send(err);
        else
            resp.send(res);
    })
   
})

app.post("/login",function(req,resp){
    var data=[req.body.email,req.body.pwd];
    dbcon.query("select type from users where email=? and pwd=?",data,function(err,result){
        if(err)
        resp.send(err.message);
        else{
            if(result[0].type=="client")
            resp.redirect("/dash-client.html");
            else
            resp.redirect("/dash-vendor.html");
        }
    })
})


//-----------------------FOR REDIRECTING TO DIFFERENT PAGES-------------------------


app.post("/vendor-panel",function(req,resp)
{
 resp.redirect("/panel-vendors.html");
 })

app.post("/prof-vend",function(req,resp)
{
        resp.redirect("/profile-vendor.html");
})

app.post("/prof-client",function(req,resp)
{
    resp.redirect("/profile-client.html");
})

app.post("/plan-func",function(req,resp){
    resp.redirect("/plan-function.html");
})



app.get("/fetch-all",function(req,resp){
    dbcon.query("select * from vendors",function(err,result)
    {
        if(err)
        resp.send(err);
        else
        resp.send(result);
   })
})

app.get("/fetch-services",function(req,resp){
    dbcon.query("select serve from vendors",function(err,result)
    {
        if(err)
        resp.send(err);
        else
        resp.send(result);
   })
})

app.get("/user-del",function(req,resp)
{
    var data=[req.query.uidx];
    dbcon.query("delete from vendors where eid=?",data,function(err,res){
        if(err)
            resp.send(err.message);
            else
            resp.send(res.affectedRows+"Record Deleted");
    })
})

app.get("/loadcity",function(req,resp){
    dbcon.query("select distinct city from vendors",function(err,result){
        if(err)
        resp.send(err);
        else 
        resp.send(result);
    })

})

app.get("loadservices",function(req,resp){
    dbcon.query("select selservices city feom vendors",function(err,result){
        if(err)
        resp.send(err);
        else 
        resp.send(result);
    })

})

app.get("/doFetchData",function(req,resp){
    console.log(req.query.thiscity);
    console.log(req.query.thisservices);
    dbcon.query("select * from vendors where city=? and serve like ?",[req.query.thiscity,"%",req.query.thisservices+"%"],function(err,result){
        if(err)
        resp.send(err);
        else 
        resp.send(result);
    })
})

app.post("/reset",function(req,resp){
    var data =[req.body.newpwd,req.body.txtemail];
    dbcon.query("update users set pwd=? where email=?",data,function(err,result){
        if (err)
                resp.send(err.message);
            else
                resp.redirect("/dash-vendor.html");
        })
})

app.post("/reset",function(req,resp){
    var data =[req.body.newpwd,req.body.txtemail];
    dbcon.query("update users set pwd=? where email=?",data,function(err,result){
        if (err)
                resp.send(err.message);
            else
                resp.redirect("/dash-client.html");
        })
})





