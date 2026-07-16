// generate items.json
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, writeFileSync } from "node:fs"; 

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = ai.getGenerativeModel({ 
  model: "gemini-3.1-flash-lite",
  generationConfig: {
    responseMimeType: "application/json",
  }
});

function fileToGenerativePart(path, mimeType) {
  const buffer = readFileSync(path);
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    },
  };
}

async function extractReceipt() {
  const prompt = `
  Analyze this receipt image and extract all the grocery items. 
  Return a JSON array of objects containing 'itemName', 'quantity' (if available, otherwise null), and 'expireIn' which is the common expire time (in days) if refregerated.
  `;
  
  const imagePart = fileToGenerativePart("uploads/receipt.jpg", "image/jpeg");
  
  try {
    console.log("Analyzing receipt...");
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    const outputFilename = "responses/grocery_items.json";
    writeFileSync(outputFilename, responseText, "utf-8");

    addTimestamp()
    
    console.log(`Success! Extracted data saved to ${outputFilename}`);
  } catch (error) {
    console.error("Failed to analyze receipt:", error);
  }
}

let output = null;
async function addTimestamp() {
  try {
    const fileData = readFileSync('responses/grocery_items.json', 'utf8');
    
    const data = JSON.parse(fileData);
    
    output = data.map(item => {
      return {
        ...item,
        dateAdded: Date.now()
      };
    });

    writeFileSync('responses/grocery_items.json', JSON.stringify(output,null,2), 'utf8'); 
    
  } catch (error) {
    console.error("Error reading or processing the JSON file:", error);
  }
}

extractReceipt();