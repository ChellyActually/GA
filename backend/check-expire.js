import { readFileSync, writeFileSync } from "node:fs";

export default function checkExpire() {
  let aboutToExpire = [];
  let notExpired = [];
  let expired = [];
  const fileData = readFileSync("responses/grocery_items.json", "utf8");

  const data = JSON.parse(fileData);

  for (let i = 0; i < data.length; i++) {
    // const daysInFridge = Math.ceil(
    //   ((Date.now() - data[i].dateAdded) / 86400000).toFixed(2)
    // );
    const daysInFridge = 6
    data[i].inFridgeDays = daysInFridge;
    if (daysInFridge >= data[i].expireIn) {
        expired.push(data[i])
      console.log(`Expired and removed: ${data[i].itemName}`);
    } else {
        notExpired.push(data[i])
        if (daysInFridge + 1 == data[i].expireIn) {
            aboutToExpire.push(data[i]);
            console.log(`About to expire in a day: ${data[i].itemName}`);
      }
    }
  }

  writeFileSync(
    "responses/about_to_expire.json",
    JSON.stringify(aboutToExpire, null, 2),
    "utf8",
  );
  writeFileSync(
    "responses/grocery_items.json",
    JSON.stringify(notExpired, null, 2),
    "utf8",
  );
  writeFileSync(
    "responses/expired.json",
    JSON.stringify(expired, null, 2),
    "utf8",
  );
}

checkExpire();
