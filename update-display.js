// update-display.js
const groceryList = document.querySelector(".grocery-list");
const ateList = document.querySelector(".ate-list");
const expiredList = document.querySelector(".expired-list");

export default async function updateDisplay() {
  const groceryData = await fetch("responses/grocery_items.json");
  const ateData = await fetch("responses/about_to_expire.json");
  const expiredData = await fetch("responses/expired.json");

  const groceryArray = await groceryData.json();
  const ateArray = await ateData.json();
  const expiredArray = await expiredData.json();

  groceryList.innerText = "";
  ateList.innerText = "";
  expiredList.innerText = "";

  for (const item of groceryArray) {
    for (const key in item) {
      groceryList.innerText += `${key} : ${item[key]}\n`;
    }
    groceryList.innerText += "\n";
  }

  for (const item of ateArray) {
    for (const key in item) {
      ateList.innerText += `${key} : ${item[key]}\n`;
    }
    ateList.innerText += "\n";
  }

  for (const item of expiredArray) {
    for (const key in item) {
      expiredList.innerText += `${key} : ${item[key]}\n`;
    }
    expiredList.innerText += "\n";
  }
}
