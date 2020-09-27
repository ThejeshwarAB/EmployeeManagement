const express = require("express")
const MongoClient = require("mongodb").MongoClient

const app = express()
const url = "mongodb://localhost:27017/agaramdb"

const port = 3001
const path = require("path")

const bodyParser = require("body-parser")
const session = require("express-session")

// var session = null

app.listen(port,(err) =>{
    if(err)
    throw err;
    else
    console.log("Server is running at: " + port)
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(bodyParser.json());

app.use(session({secret: 'ssshhhhh'}))

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'login.html'))
})

app.get('/admin.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'admin.html'))
})

app.post('/admin.html',(req,res)=>{
    details = {
        user: session.user,
        pass: session.pass
    }
    res.send(details)

})

app.get('/user.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'user.html'))
})

app.post('/user.html',(req,res)=>{
    details = {
        user: session.user,
        pass: session.pass
    }
    res.send(details)
})

app.post('/update.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'update.html'))
})

app.post('/admintable.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'admintable.html'))
})

app.post('/usertable.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'usertable.html'))
})

app.post('/text.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'text.html'))
})



app.post('/article.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'article.html'))
})
app.post('/userdetail.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'userdetail.html'))
})


app.post('/file.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'file.html'))
})

app.post('/login.html',(req,res)=>{
    console.log(req.body)
    var user = req.body.user 
    var pass = req.body.pass
    MongoClient.connect(url,{ useUnifiedTopology: true },(err, db)=>{
        if(err) throw err 
        console.log(user,pass)
        var database = db.db()
            database.collection("agaram").findOne({username: user, password: pass}, function(err, result) {
            if (err) throw err
            console.log(result,"is the result")
            if (result){
                session.user = user 
                session.pass = pass 
                session.mobile = result["mobile"]
                session.mail = result["mail"]
                session.address =result["address"]
                session.adminStatus = result["adminStatus"]
                res.send(result)}                
            else 
                res.send("")
            db.close()
          })
    })
})

app.post('/', (req,res)=>{
    console.log("This button is working")
    var id=req.body.empid
    var username = req.body.newuser
    var password = req.body.newpass
    var mobile = req.body.newmobile
    var mail = req.body.newmail
    var specific =req.body.specific
    var address=req.body.address
    var dob =req.body.dob
    var doj=req.body.doj
    //var workCount = parseInt(req.body.workCount)
    // var flag = req.body.flag
    var adminStatus = req.body.adminStatus == 'true' ? true : false 

    if(username!=null && password!=null){

    // console.log(typeof adminStatus)
    // console.log("Added to database")
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log("Switched to "+database.databaseName)
        // execute this to add user
        // database.createCollection("agaram", function(err, result) {
            database.collection("agaram").insertOne({
                empid:id,
                username: username,
                password: password,
                mobile: mobile,
                mail: mail,
                DOB : dob,
                specific :specific,
                address:address,
                DOJ:doj,
                adminStatus: adminStatus,
                articlestatus:false,
                workCount: 0,
                work: [],
                articlename: null,
                TotalPass: null,
                client:null,
                articletype:null,
                blank : null,
                reference:null,})
            console.log("Added to database")
        // })
        //to perform insertion of data - execute only once
        // database.collection("agaram").deleteOne({
        //     username:"admin"
        // })
        //to perform deletion of data - execute if inserted many
        //execute this only once
        database.collection("agaram").find({}).toArray(function(err, result) {
            if (err) throw err
            console.log(result)
            res.send("ok")
            db.close()
        }) 
    })
    }
})

app.post('/changes',(req,res)=>{
    console.log("Called")
    console.log(session.user)
    res.send({ user:session.user , mail: session.mail, mobile: session.mobile,address: session.address })
})

app.post('/updateprofile',(req,res)=>{
    console.log("Updating profile")
    var newuser = req.body.user
    var newmail = req.body.mail 
    var newmobile = req.body.mobile
    var address =req.body.address
    var user = session.user 
    var pass = session.pass 
    // if(oldpass == pass){
    // console.log(newuser,newpass)
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log("Switched to "+database.databaseName)
        // execute this to add user
        // database.createCollection("agaram", function(err, result) {
            database.collection("agaram").updateOne(
                {
                username:user,
                password:pass},
                {
                    $set: {
                        username: newuser,
                        mail: newmail,
                        mobile: newmobile,
                        address : address,
                    }
                },
                function(err, res) {
                    console.log("Updated password to database")})
        database.collection("agaram").find({}).toArray(function(err, result) {
            if (err) throw err
            console.log(result)
            res.send("ok")
            db.close()
        })
    })
})

app.post('/updatepassword',(req,res)=>{
    console.log("Updating password")
    var oldpass = req.body.oldpass
    var newpass = req.body.newpass 
    var user = session.user 
    var pass = session.pass 
    if(oldpass == pass){
    // console.log(newuser,newpass)
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log("Switched to "+database.databaseName)
        // execute this to add user
        // database.createCollection("agaram", function(err, result) {
            database.collection("agaram").updateOne(
                {
                username:user,
                password:pass},
                {
                    $set: {
                        password: newpass 
                    }
                },
                function(err, res) {
                    console.log("Updated password to database")})
        database.collection("agaram").find({}).toArray(function(err, result) {
            if (err) throw err
            console.log(result)
            res.send("ok")
            db.close()
        })
    })
    }
    else
        res.send("")
})

app.post("/logout",(req,res)=>{
    // console.log("This is called")
    req.session.destroy()
    // session.destroy()
    res.send("ok")
})

app.post("/back",(req,res)=>{
    res.send("ok")
})

MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
    if(err) throw err
    var database=db.db()
    console.log("Switched to "+database.databaseName)
    // // execute this only once
    // database.createCollection("agaram", function(err, result) {
    //     database.collection("agaram").insertOne({
    //         username:"admin",
    //         password:"1234",
    //         adminStatus:true})
    //     console.log("Added to database")
    // })
    //to perform insertion of data - execute only once
   //  database.collection("agaram").deleteMany({
   //     username:"user"
   // })
    // database.collection("agaram").deleteOne({
    //     username:'ThejeshwarAB'
    // })

    // //to perform deletion of data - execute if inserted many
    // //execute this only once
    database.collection("agaram").find({}).toArray(function(err, result) {
        if (err) throw err
        console.log(result)
        db.close()
      }) 
})

app.post('/fetchforadmin',(req,res)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log("Switched to "+database.databaseName)
        database.collection("agaram").find({
            adminStatus: false,
             //articlestatus: false,
            // workCount: { $gt: 0 }
        }).toArray(function(err, result) {
            if (err) throw err
            console.log(result)
            res.send(result)
            db.close()
          }) 
    })
})

app.post('/fetchforuser',(req,res)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log("Switched to "+database.databaseName)
        database.collection("agaram").find({
            
            username: session.user,
            password: session.pass
        }).toArray(function(err, result) {
            if (err) throw err
            console.log(result)
            res.send(result)
            db.close()
          }) 
    })
})


app.post('/fetchforarticle',(req,res)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log("Switched to "+database.databaseName)
        database.collection("agaram").find({
            articlestatus: true,
            // workCount: { $gt: 0 }
        }).toArray(function(err, result) {
            if (err) throw err
            console.log(result)
            res.send(result)
            db.close()
          }) 
    })
})

app.post('/createWork',(req,res)=>{
    var user = req.body.user
    var workdesc = req.body.workdesc
    var worktype = req.body.worktype
    var start = req.body.start 
    var end = req.body.end
    var endpage=req.body.endpage
    var range=req.body.range
    console.log(user+" printed outside MongoDB")
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log(user+" printed inside MongoDB")
        console.log("Switched to "+database.databaseName)
        database.collection("agaram").updateOne({ username: user },
        { 
            $inc: { workCount: 1 },
            $addToSet: { work:{
                                desc: workdesc,
                                type: worktype,
                                start: start, 
                                end: end,
                                range :range, 
                                endpage:endpage,                              
                                progress: "Pending",
                                workup: "Description",
                                }
                        },
        },
        function(err, result) {
            console.log("Updated work to database")
            res.send("ok")
            db.close()})
          })  
})

app.post('/createArticle',(req,res)=>{
    var name = req.body.name
    var pass = req.body.pass
    var articletype = req.body.articletype
    var blank = req.body.blank
    var client=req.body.client
    var reference = req.body.reference
    console.log(name+" printed outside MongoDB")
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log(name+" printed inside MongoDB")
        console.log("Switched to "+database.databaseName)
      database.collection("agaram").insertOne({
               empid:null,
               username: null,
                password: null,
                mobile: null,
                mail: null,
                DOB : null,
                specific :null,
                address:null,
                DOJ:null,
                adminStatus: false,
                articlestatus:true,
                workCount: 0,
                work: [],
                articlename: name,
                TotalPass: pass,
                client:client,
                articletype:articletype,
                blank : blank,
                reference:reference
                })
      console.log("Article Added")
      database.collection("agaram").find({}).toArray(function(err, result) {
            if (err) throw err
            console.log(result)
            res.send("ok")
            db.close()
        })
          })  
})

app.post('/editWork',(req,res)=>{
    var user = req.body.user
    var workdesc = req.body.workdesc
    var worktype = req.body.worktype
    var range = req.body.range
    var end = req.body.end
    var endpage=req.body.endpage
    console.log(workdesc)
    console.log(worktype)

    console.log(workdesc+" printed outside MongoDB")
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log(user+" printed inside MongoDB")
        console.log("Switched to "+database.databaseName)
        database.collection("agaram").updateOne({ username: user,"work.desc":workdesc },
            {
             $set : { "work.$.type" : worktype }
             }),
         database.collection("agaram").updateOne({ username: user,"work.desc":workdesc },
            {
             $set : { "work.$.range" : range }
             }),
         database.collection("agaram").updateOne({ username: user,"work.desc":workdesc },
            {
             $set : { "work.$.endpage" : endpage }
             }),
        database.collection("agaram").updateOne({ username: user,"work.desc":workdesc },
            {
             $set : { "work.$.end" : end }
             },
        function(err, result) {
            console.log("Updated work to database")
            res.send("ok")
            db.close()
        })
    })
})
          
app.post('/editProgress',(req,res)=>{
    var user = session.user
    var workdesc = req.body.workdesc
    var worktype = req.body.worktype
    var status = req.body.status
    var workup=req.body.workup
    var endpage = req.body.endpage
    console.log(user+" printed outside MongoDB")
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log(user+" printed inside MongoDB")
        console.log("Switched to "+database.databaseName)
        console.log(status)
        console.log(workdesc)
        database.collection("agaram").updateOne({ username: user,"work.desc":workdesc },
            {
             $set : { "work.$.workup" : workup }
             }),
       database.collection("agaram").updateOne({ username: user,"work.desc":workdesc },
            {
             $set : { "work.$.progress" : status }
             },
        function(err, result) {
            console.log("Updated work to database")
            res.send("ok")
            db.close()
        })
    })  
          
})

app.post('/editArticle',(req,res)=>{
    var user = req.body.articlename
    var pass = req.body.pass
    var arttype = req.body.articletype
  var blank =req.body.blank
    var ref = req.body.reference
 var client=req.body.client
   // console.log(articlename)
    console.log(pass)
    console.log(arttype)
    console.log(ref)
   console.log(blank) 
    console.log(blank +" printed outside MongoDB")
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        //console.log(user+" printed inside MongoDB")
        console.log("Switched to "+database.databaseName)
        database.collection("agaram").update({ articlename: user },
             {         "username": null,
                       "password": null,
                       "mobile": null,
                       "mail": null,
                       "adminStatus": false,
                       "articlestatus":true,
                       "workCount":null,
                       "work":null,
                      "articlename": user,
                      "TotalPass" : pass,
                      "client":client,
                      "articletype" : arttype,
                      "blank" : blank,  
                      "reference" : ref,
         },
        function(err, result) {
            console.log("Updated work to database")
            res.send("ok")
            db.close()
        })
    })
})
      

app.post('/edituseradmin',(req,res)=>{
    var id = req.body.id
    var name = req.body.name
    var specific = req.body.specific
    var mobile = req.body.mobile
    var mail =req.body.mail
    var address = req.body.address
    var dob=req.body.dob
    var doj=req.body.doj
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        //console.log(user+" printed inside MongoDB")
        console.log("Switched to "+database.databaseName)
        database.collection("agaram").updateOne({ empid: id,username: name },
           {$set:{     username: name,
                       mobile: mobile,
                       mail: mail,
                       specific:specific,
                       address:address,
                       DOB:dob,
                       DOJ:doj,
         }},
        function(err, result) {
            console.log("Updated user to database")
            res.send("ok")
            db.close()
        })
    })
})

app.post('/deleteWork',(req,res)=>{
    var user = req.body.user
    var workdesc = req.body.workdesc
    var worktype = req.body.worktype
    var end = req.body.end
    console.log(user+" printed outside MongoDB")
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log(user+" printed inside MongoDB")
        console.log("Switched to "+database.databaseName)
        database.collection("agaram").update({ username: user },
        { 
            $pull: {"work":{desc: workdesc}}},
        function(err, result) 
        {
            database.collection("agaram").find({}).toArray(function(err, result) {
                console.log("Updated work to database")
                res.send("ok")
                db.close()})
          })  
          
    })
})

app.post('/deletearticle',(req,res)=>{
    var user = req.body.articlename
    console.log(user+" printed outside MongoDB")
    console.log(user)
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log(user+" printed inside MongoDB")
        console.log("Switched to "+database.databaseName)
        database.collection("agaram").deleteOne({ articlename : user },
        function(err, result) 
        {
            database.collection("agaram").find({}).toArray(function(err, result) {
                console.log("Updated Article to database")
                res.send("ok")
                db.close()})
          })  
          
    })
})

app.post('/deleteemp',(req,res)=>{
    var user = req.body.name
    var empid = req.body.empid
    console.log(parseInt(empid))
    console.log(user+" printed outside MongoDB")
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
        var database=db.db()
        console.log(user+" printed inside MongoDB")
        console.log("Switched to "+database.databaseName)
        database.collection("agaram").deleteOne({ username: user,empid :empid },
        function(err, result) 
        {
            database.collection("agaram").find({}).toArray(function(err, result) {
                console.log("User Deleted to database")
                res.send("ok")
                db.close()})
          })
    })
})

app.post('/userdetailfile',(req,res)=>{
     var id =req.body.content
     console.log(id)
     console.log(typeof id)
     var hello = JSON.parse(id);
     var cnt=0
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
    for (item in hello) {
    console.log(hello[item]["Emp ID"]);
    console.log(hello[item]["Emp Name"]);
    console.log(hello[item]["Specification"]);
    console.log(hello[item]["Mob. No."]);
    console.log(hello[item]["Email"]);
    console.log(hello[item]["Address"]);
    console.log((hello[item]["D.O.B"]));
    console.log((hello[item]["D.O.J"]));
    var ids=hello[item]["Emp ID"]
    var id=String(ids)
    var username = hello[item]["Emp Name"]
    var passwords = hello[item]["pass"]
    var password=String(passwords)
    var mobile = hello[item]["Mob. No."]
    var mail = hello[item]["Email"]
    var specific =hello[item]["Specification"]
    var address=hello[item]["Address"]
    var dob =(hello[item]["D.O.B"])
    var doj=(hello[item]["D.O.J"])
        var database=db.db()

        database.collection("agaram").findOne({empid:id},forceServerObjectId=true,function(err, result) {
            if (err) throw err
            console.log(result,"is the result")
            if (result){
                console.log("lready it is present")
                }              
            else {
                console.log("Switched to "+database.databaseName)
            database.collection("agaram").insertOne({
                empid:id,
                username: username,
                password: password,
                mobile: mobile,
                mail: mail,
                DOB : dob,
                specific :specific,
                address:address,
                DOJ:doj,
                adminStatus: false,
                articlestatus:false,
                workCount: 0,
                work: [],
                articlename: null,
                TotalPass: null,
                client:null,
                articletype:null,
                blank : null,
                reference:null,},forceServerObjectId=true,
                function(err, result) 
                {
                database.collection("agaram").find({}).toArray(function(err, result) {
                console.log("User Detail migarted to database")
                db.close()})
                 }
                )  
            }
            
          })
       }
        
        res.send("ok")
    })
    // res.send("ok")
})
// })

app.post('/articlefile',(req,res)=>{
     var id =req.body.content
     console.log(id)
     console.log(typeof id)
     var hello = JSON.parse(id);
     var cnt=0
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
    for (item in hello) {
     var name = hello[item]["Article Name"]
    var pass = hello[item]["Total Pages"]
    var articletype = hello[item]["Type of Article"]
    var blank = hello[item]["Blank Pages"]
    var client=hello[item]["Vendor"]
    var reference = hello[item]["Reference"]
    var database=db.db()

     database.collection("agaram").findOne({articlename: name},forceServerObjectId=true,function(err, result) {
            if (err) throw err
            console.log(result,"is the result")
            if (result){
                console.log("Already it is present")
                }              
            else {
        console.log("Switched to "+database.databaseName)
            database.collection("agaram").insertOne({
                empid:null,
                username: null,
                password: null,
                mobile: null,
                mail: null,
                DOB : null,
                specific :null,
                address:null,
                DOJ:null,
                adminStatus: false,
                articlestatus:true,
                workCount: 0,
                work: [],
                articlename: name,
                TotalPass: pass,
                client:client,
                articletype:articletype,
                blank : blank,
                reference:reference},forceServerObjectId=true,
                function(err, result) 
                {
                database.collection("agaram").find({}).toArray(function(err, result) {
                console.log("User Detail migarted to database")
               // res.send("ok")
                db.close()})
                })}})
        }
         res.send("ok")
        })
})

app.post('/workfile',(req,res)=>{
     var id =req.body.content
     console.log(id)
     console.log(typeof id)
     var hello = JSON.parse(id);
     var cnt=0
    MongoClient.connect(url, { useUnifiedTopology: true }, (err,db)=>{
        if(err) throw err
    for (item in hello) {
        var use = hello[item]["Employee Name"]
        var user=use.toString()
        var workdesc = hello[item]["Article Name"]
        var worktype = hello[item]["Work Type"]
        var range = hello[item]["Starting Page"]
        var endpage = hello[item]["Ending Page"]
        var end = hello[item]["End date"]
        var start= hello[item]["Start date"]
        var prog=hello[item]["Work Status"]   
        var com=hello[item]["Work Comments"]
        console.log(user)
         console.log(workdesc)
          console.log(worktype)
           console.log(range)
            console.log(endpage)
        if(err) throw err
        var database=db.db()
        console.log(user+" printed inside MongoDB")
        console.log("Switched to "+database.databaseName)
        database.collection("agaram").updateOne({ username: user },
        { 
            $inc: { workCount: 1 },
            $addToSet: { work:{
                                desc: workdesc,
                                type: worktype,
                                start: start, 
                                end: end,
                                range :range, 
                                endpage:endpage,                              
                                progress: prog,
                                workup: com,
                                }
                        },},forceServerObjectId=true,
                function(err, result) 
                {
                database.collection("agaram").find({}).toArray(function(err, result) {
                console.log("User Detail migarted to database")
                db.close()})
                },)      
}
         res.send("ok")
        // db.close()

})})