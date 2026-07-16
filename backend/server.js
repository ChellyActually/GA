import express from "express";
import cors from "cors";
import multer from 'multer';
import { readFileSync } from "node:fs";
import { exec } from 'node:child_process';

const app = express();
app.use(cors()); // Allows your frontend to connect

const storage = multer.diskStorage({
  // Tell it where to save the file
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  // Tell it exactly what to name the file
  filename: (req, file, cb) => {
    cb(null, 'receipt.jpg'); 
  }
});

// 2. Pass that storage engine to multer
const upload = multer({ 
  storage: storage
});

app.post('/api/upload', upload.single('receiptImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  console.log("Image saved! Starting processing scripts...");

  // Run your scripts sequentially using '&&'
  // Note: Ensure generate-json.js and check-expire.js are in the backend folder!
  const command = 'node --env-file=../.env generate-json.js && node check-expire.js';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Script Error:", error.message);
      return res.status(500).json({ error: "Image saved, but scripts failed to run." });
    }
    
    console.log("Script output:", stdout);

    // Send success ONLY after the scripts finish writing the new JSON
    res.json({ 
      message: "Receipt uploaded and processed successfully!",
    });
  });
});

// Create an API endpoint for groceries
app.get("/api/groceries", (req, res) => {
  try {
    const fileData = readFileSync("responses/grocery_items.json", "utf8");
    const data = JSON.parse(fileData);
    // Send the data over the network
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to read data" });
  }
});

app.get("/api/ate", (req, res) => {
  try {
    const fileData = readFileSync("responses/about_to_expire.json", "utf8");
    const data = JSON.parse(fileData);
    // Send the data over the network
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to read data" });
  }
});

app.get("/api/expired", (req, res) => {
  try {
    const fileData = readFileSync("responses/expired.json", "utf8");
    const data = JSON.parse(fileData);
    // Send the data over the network
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to read data" });
  }
});

app.get('/api/recipe', async (req, res) => {
  try {
    // This runs your script and waits for the AI to finish
    const recipe = await generateCookingRecipe();
    
    // Sends the final text directly back to the browser
    res.json({ recipe: recipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});


// Start the server on port 3000
app.listen(3005, () => {
  console.log("Backend API running at http://localhost:3005");
});
