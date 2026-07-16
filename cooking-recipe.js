// inputs : items and no. of items
// outputs : cooking recipe
import{GoogleGenerativeAI} from "@google/generative-ai";
import {readFileSync,writeFileSync,existsSync} from "node:fs";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({model:"gemini-3.1-flash-lite"});

export default async function generateCookingRecipe(){
    const filePath = 'response/about_to_expire.json';
    const outputRecipePath = "response/cooking-recipe.json";
    try{
        if(!existsSync(filePath)){
            return "No expiration data found. Run checkExpire first.";
        }
        const fileData = readFileSync(filePath,'utf8');
        const items = JSON.parse(fileData);

        if(items.length===0){
            return "Great news!! No items are expiring tomorrow. No recipes needed";
        }

        const itemNames = items.map(item => `${item.itemName} (Qty: ${item.quantity || "N/A"})`).join(", ");
        const prompt = `
      You are a resourceful chef. I have the following grocery items that are expiring tomorrow: ${itemNames}.
      
      Please generate a delicious recipe that prioritizes using these specific ingredients so they don't go to waste. 
      Include:
      - Recipe Title
      - Prep & Cook Time
      - Ingredients used 
      - Step-by-step instructions
    `;
    console.log("Generating recipe using expiring ingredients...");
    const result = await model.generateContent(prompt);
    const recipeText = result.response.text();
    writeFileSync(outputRecipePath,recipeText,'utf8');
    return recipeText;

    }
    catch(error){
        console.error("Error generating recipe: ",error);
        return "Failed to generate recipe due to an error.";
    }
}
