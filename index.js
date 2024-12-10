import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.get("/delete",(req,res)=>{
    res.send("Delete");

});
app.get("/edit",(req,res)=>{
    res.send("Edit");
    console.log(req);
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});