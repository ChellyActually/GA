// generate-json.js
// setInterval - run check-expire.js every day
// if about_to_expire.length > 0 , run cooking-recipe.js and give sms

import updateDisplay from "./update-display.js";

function updateDashboard(){
    const lastRefreshed = document.querySelector("#lastRefreshed")

    const now = new Date();
    lastRefreshed.innerText = `Last Refreshed : ${now.toLocaleDateString()} - ${now.toTimeString()}`

    updateDisplay()
}

updateDashboard()
setInterval(updateDashboard, 15000)
