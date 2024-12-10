import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const datas = [{id:1, heading:"this is heading", title: "This is title", date: ''}, { id: 2, heading: "Another heading", title: "Another title", date: '' },];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.render("index.ejs",{data:datas});
});

app.get("/create",(req,res)=>{
    res.render("modify.ejs");
})
app.post("/create",(req,res)=>{
    console.log(req.body);
    const { Heading, Description, date } = req.body;
    const newProject = {
        id: datas.length + 1,  // Automatically assign an ID (just an example, you can handle this differently)
        heading: Heading,
        title: Description,
        date: date
    };
    datas.push(newProject);
    res.redirect("/");
})

app.get("/action",(req,res)=>{
    // res.send("Done bro");
    console.log(req.query);
    const {editNote, deleteNote} = req.query;
    const noteId = req.query.noteId;
    console.log(editNote, deleteNote, noteId);
    
  try {
    if(editNote){
        console.log("the edit Note is ", editNote);
        const selectedNote = datas.find(item => item.id == editNote);
        res.render("modify.ejs",{note:selectedNote});
    }
    else if(deleteNote){
        console.log("the delete note is", deleteNote);
        
        const index = datas.findIndex(item => item.id == deleteNote);

        if (index !== -1) {
            // Remove the object from the array using splice
            datas.splice(index, 1);  // Removes 1 item at the found index
            console.log("Updated datas array:", datas);
        } else {
            console.log("Item not found!");
        }

        
        res.redirect("/");
    }
  } catch (error) {
    res.sendStatus(400).send("wrong oops");
  }
});

// for update 
app.post("/update", (req,res)=>{
    // res.send("updating on the go");
    console.log(req.body);
   const foundData = datas.find(item => item.id == req.body.updateID);
   console.log("This is found data ", foundData);
    if(foundData){
        foundData.heading = req.body.heading;
        foundData.title = req.body.paragraph;
        foundData.date = req.body.date[0];
    }
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});