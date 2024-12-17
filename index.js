import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const API = 'http://localhost:4000';
const saltRounds = 10;
let hashing;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

// auth
// login
app.get("/login", async(req,res)=>{
  res.render("login.ejs",{current: true})
});

app.post("/login", async (req,res)=>{

  console.log("this is login \n", req.body);
  // { email: 'asfefsfd@email.com', password: 'asfafegfeas' }
  const myPlaintextPassword = req.body.password;
  bcrypt.compare(myPlaintextPassword, hashing, function(err, result) {
    if(err){
      console.log("login error", err);
    } else {
      console.log("the login result ", result);
    }
});

});

// register
app.get("/register", async(req,res)=>{
  res.render("register.ejs",{current: true})
});

app.post("/register", async (req,res)=>{

  console.log("this is register \n", req.body);
  // { email: 'subhajit13dhar@gmail.com', password: 'afsefewaegfaege' }
  const {username, email, password} = req.body;
  const result = await axios.post(`${API}/api/register`, {username: username, email:email, password : password});
  console.log("this is result",result.data);
});


// the first page to reload
app.get("/", async (req, res) => {
    try {
       const response = await axios.get(`${API}/api/posts`);
    //    console.log("this is response ", response.data);
       res.render("index.ejs", { data: response.data });
    } catch (error) {
       console.log(error.message);
       res.render("index.ejs", { data: [] });  // or handle error appropriately
    }
 });


 //for creation of new post 
app.get("/create",(req,res)=>{
    res.render("modify.ejs");
});
//for adding the data in the creation note
app.post("/create",async (req,res)=>{
    
    try {
        const response = await axios.post(`${API}/api/posts`, req.body);
        // console.log("this is response on create",response.data);
        res.redirect("/");
      } catch (error) {
        res.status(500).json({ message: "Error creating post" });
      }
})

app.get("/action",async (req,res)=>{
    // res.send("Done bro");
    // console.log(req.query);
    const {editNote, deleteNote} = req.query;
    const noteId = req.query.noteId;
    console.log(editNote, deleteNote, noteId);
    
  try {
    if(editNote){
        //for getting the data from the api and sending it in frontend
        // console.log("the edit Note is ", editNote);
        const response = await axios.get(`${API}/api/posts/${editNote}`);
        // console.log("this is response for edit",response.data);
        const data = response.data;
        res.render("modify.ejs",{note:response.data});
    }
    else if(deleteNote){
        console.log("the delete note is", deleteNote);
       try {
        const response = await axios.delete(`${API}/api/posts/${deleteNote}`);
        console.log("post deleted", response.data);
        res.redirect("/")
       } catch (error) {
        console.log("error deleting data",error.message)
       }
    }
  } catch (error) {
    res.sendStatus(400).send("wrong oops");
  }
});

// for update 
app.post("/update",async (req,res)=>{
   
    console.log("this is for update",req.body);

    try {
        const response = await axios.patch(
          `${API}/api/posts/${req.body.updateID}`,
          req.body
        );
        console.log("this is after the update",response.data);
        res.redirect("/");
      } catch (error) {
        res.status(500).json({ message: "Error updating post" });
      }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});