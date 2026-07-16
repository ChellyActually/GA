// generate-json.js
// setInterval - run check-expire.js every day
// if about_to_expire.length > 0 , run cooking-recipe.js and give sms
import checkExpire from "./check-expire.js";
import generateCookingRecipe from "cooking-recipe.js";

async function runWorkflow(){
    console.log("Step1: Checking for Expired and Expiring Items...");
    await checkExpire();

    console.log("Step 2: Requesting Recipe for Items in Expiring Tomorrow...");
    const recipeOutput = await generateCookingRecipe();

    console.log("\n---Final Recipe Output---");
    console.log(recipeOutput);
}

runWorkflow();