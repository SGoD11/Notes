import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;

//database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "NotePad",
  password: "sdhar",
  port: 5432,
});
db.connect();

async function fetchData() {
  const result = await db.query('SELECT * FROM public."NoteePad"');
  console.log("This is result", result.rows);
  return result.rows;
}

// In-memory data store
let posts = await fetchData();

let lastId = posts.length;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET all posts
app.get("/api/posts", (req, res) => {
  console.log(posts);
  res.json(posts);
});

// GET a specific post by id
app.get("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// POST a new post
app.post("/api/posts", (req, res) => {
  const newId = lastId += 1;
  const post = {
    id: newId,
    heading: req.body.Heading,
    title: req.body.Description,
    date: req.body.date,
  };
  lastId = newId;
  posts.push(post);
  res.status(201).json(post);
});

// PATCH a post when you just want to update one parameter
app.patch("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.body.heading) post.heading = req.body.heading;
  if (req.body.paragraph) post.title = req.body.paragraph;
  if (req.body.date) post.date = req.body.date[0];

  res.json(post);
});

// DELETE a specific post by providing the post id
app.delete("/api/posts/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts.splice(index, 1);
  res.json({ message: "Post deleted" });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
