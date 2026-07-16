// generate-json.js
// setInterval - run check-expire.js every day
// if about_to_expire.length > 0 , run cooking-recipe.js and give sms
import updateDisplay from "./update-display.js";

function updateDashboard() {
  const lastRefreshed = document.querySelector("#lastRefreshed");

  const now = new Date();
  lastRefreshed.innerText = `Last Refreshed : ${now.toLocaleDateString()} - ${now.toTimeString()}`;

  updateDisplay();
}

const imageInput = document.querySelector("#imageInput");
const uploadBtn = document.querySelector("#uploadBtn");
const recipeDisplay = document.querySelector("#recipe-display");

uploadBtn.addEventListener("click", async () => {
  if (imageInput.files.length === 0) {
    alert("Please select an image first!");
    return;
  }

  // Change button text so the user knows it's working (processing takes time)
  uploadBtn.innerText = "Processing...";
  uploadBtn.disabled = true;

  const formData = new FormData();
  formData.append("receiptImage", imageInput.files[0]);

  try {
    const response = await fetch("http://localhost:3005/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      // Instantly refresh the screen to show the newly extracted items!
      await updateDisplay();
    } else {
      alert("Error: " + result.error);
    }
  } catch (error) {
    console.error("Upload error:", error);
  } finally {
    // Reset the button
    uploadBtn.innerText = "Upload Image";
    uploadBtn.disabled = false;
    imageInput.value = ""; // Clear the file input
  }
});

updateDashboard();
const getRecipe = document.querySelector("#get-recipe");
let recipeText = "";

async function displayRecipe(event) {
  event?.preventDefault();

  const response = await fetch("http://localhost:3005/api/recipe");
  const data = await response.json();
  localStorage.setItem("savedMessage", data.recipe);
}

getRecipe.addEventListener("click", displayRecipe);

const msg = localStorage.getItem("savedMessage");
if (msg) {
  recipeDisplay.innerHTML = msg.split("\n").slice(1, -1).join("\n");
}

const hideRecipe = document.querySelector("#hide-recipe");
hideRecipe.addEventListener("click", () => {
  if (hideRecipe.innerText == "unhide") {
    recipeDisplay.classList.remove("hidden");
    hideRecipe.innerText = "hide";
    return;
  }
  recipeDisplay.classList.add("hidden");
  hideRecipe.innerText = "unhide";
});

setInterval(updateDashboard, 15000);
