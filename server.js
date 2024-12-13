import express, { json } from "express";
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
  const result = await db.query('SELECT * FROM public."NoteePad" ORDER BY id');
  // console.log("This is result", result.rows);
  return result.rows;
}
async function insertData(heading, title, date) {
  try {
    const result = await db.query(
      'INSERT INTO public."NoteePad" (heading, title, date) VALUES ($1, $2, $3)',
      [heading, title, date]
    );
    console.log("Successful insertion of data:", result);
  } catch (error) {
    console.log("Error inserting data", error);
  }
}

async function findPost(id){
const found = await db.query('SELECT * FROM public."NoteePad" WHERE id = $1',[id]);
console.log("Id is triggered",found.rows);
if (found.rows.length === 0)
  return [{message: "Nothing Found"}];
return found.rows;
}

async function updatePost(id, heading, title, date) {
  try {
    // Ensure that the values are valid before attempting the query
    if (!id || !heading || !title || !date) {
      throw new Error("Invalid input data");
    }

    const update = await db.query(
      'UPDATE public."NoteePad" SET heading = $1, title = $2, date = $3 WHERE id = $4',
      [heading, title, date, id]
    );

    if (update.rowCount === 0) {
      // This means no rows were updated (post with that id might not exist)
      throw new Error("Post not found or no changes made");
    }

    console.log("Post updated successfully:", update);
  } catch (error) {
    console.error("Error updating post:", error.message);
    throw error; // Re-throw the error to be caught in the route handler
  }
}


async function deletePost(id) {
  try {
    const result = await db.query('DELETE FROM public."NoteePad" WHERE id = $1', [id]);
    console.log("Post deleted:", result);
  } catch (error) {
    console.log("Error deleting post:", error);
    throw error;
  }
}


// In-memory data store


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET all posts
app.get("/api/posts", async (req, res) => {
  console.log( await fetchData());
  res.json(await fetchData());
});

// GET a specific post by id
app.get("/api/posts/:id", async (req, res) => {
  const found = await findPost(parseInt(req.params.id));
  const post =  found.find((p) => p.id === parseInt(req.params.id));
  console.log("this is matching post ", post);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// POST a new post
app.post("/api/posts", async (req, res) => {
  const { Heading, Description, date } = req.body;

  // Log the received data for debugging
  console.log("Received data:", req.body);

  // Check for required fields
  if (!Heading || !Description || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Call insertData and await the result
    await insertData(Heading, Description, date);
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.log("Error inserting data:", error);
    res.status(500).json({ error: "Error inserting data" });
  }
});


// PATCH a post when you just want to update one parameter
app.patch("/api/posts/:id", async (req, res) => {
  const id = req.params.id;
  const { heading, paragraph, date } = req.body;

  // Check for required fields
  if (!heading || !paragraph || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Ensure date is correctly formatted (e.g., a single string in ISO 8601 format)
  let formattedDate;
  if (Array.isArray(date)) {
    formattedDate = date[1]; // assuming the second date is correct
  } else {
    formattedDate = date;
  }

  try {
    // Call the updatePost function to update the record in the database
    await updatePost(id, heading, paragraph, formattedDate);
    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.log("Error updating post:", error.message); // Log the error message
    res.status(500).json({ error: error.message || "Error updating post" });
  }
});




// DELETE a specific post by providing the post id
app.delete("/api/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const post = await findPost(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Delete the post from the database
    await deletePost(id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});
app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
